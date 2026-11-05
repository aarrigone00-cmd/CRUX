import { supabase } from '@/lib/supabase';
import type { CheckIn, ClimbGoal, ClimbSession, CruxData, PlannedWorkout, Priority, Profile } from '@/lib/types';
import { emptyData } from './demo';

/** Map between Supabase rows (snake_case) and app types. All queries are scoped by RLS to the signed-in user. */

export async function fetchAll(userId: string): Promise<CruxData> {
  const [profile, checkIns, priorities, workouts, sessions, goals] = await Promise.all([
    supabase.from('profiles').select('display_name, focus_activities, boulder_scale, route_scale').eq('id', userId).maybeSingle(),
    supabase.from('check_ins').select('*').order('date'),
    supabase.from('priorities').select('*').order('created_at'),
    supabase.from('workouts').select('*').order('created_at'),
    supabase.from('climb_sessions').select('*, climbs(*)').order('date').order('created_at', { referencedTable: 'climbs' }),
    supabase.from('climb_goals').select('*').order('created_at'),
  ]);
  const err = profile.error || checkIns.error || priorities.error || workouts.error || sessions.error || goals.error;
  if (err) throw err;

  const data = emptyData();
  if (profile.data) {
    data.profile = {
      displayName: profile.data.display_name ?? '',
      focusActivities: profile.data.focus_activities ?? data.profile.focusActivities,
      boulderScale: profile.data.boulder_scale ?? 'V',
      routeScale: profile.data.route_scale ?? 'YDS',
    };
  }
  for (const r of checkIns.data ?? []) {
    data.checkIns[r.date] = {
      date: r.date,
      mood: r.mood,
      energy: r.energy,
      stress: r.stress,
      sleepHours: Number(r.sleep_hours),
      pain: r.pain ?? [],
      note: r.note ?? undefined,
      updatedAt: r.updated_at,
    };
  }
  data.priorities = (priorities.data ?? []).map((r) => ({ id: r.id, date: r.date, text: r.text, done: r.done }));
  data.workouts = (workouts.data ?? []).map((r) => ({
    id: r.id,
    date: r.date,
    type: r.type,
    title: r.title,
    durationMin: r.duration_min,
    intensity: r.intensity,
    completed: r.completed,
  }));
  data.climbSessions = (sessions.data ?? []).map((r) => ({
    id: r.id,
    date: r.date,
    discipline: r.discipline,
    setting: r.setting,
    location: r.location,
    durationMin: r.duration_min,
    notes: r.notes,
    climbs: (r.climbs ?? []).map((c: Record<string, any>) => ({ id: c.id, name: c.name, gradeIndex: c.grade_index, attempts: c.attempts, outcome: c.outcome, notes: c.notes })),
  }));
  data.climbGoals = (goals.data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    discipline: r.discipline,
    targetIndex: r.target_index,
    targetDate: r.target_date,
    done: r.done,
    createdAt: r.created_at,
  }));
  return data;
}

const sessionRow = (uid: string, x: ClimbSession) => ({
  id: x.id,
  user_id: uid,
  date: x.date,
  discipline: x.discipline,
  setting: x.setting,
  location: x.location,
  duration_min: x.durationMin,
  notes: x.notes,
});
const climbRows = (uid: string, x: ClimbSession) =>
  x.climbs.map((c) => ({ id: c.id, user_id: uid, session_id: x.id, name: c.name, grade_index: c.gradeIndex, attempts: c.attempts, outcome: c.outcome, notes: c.notes }));
const goalRow = (uid: string, g: ClimbGoal) => ({
  id: g.id,
  user_id: uid,
  title: g.title,
  discipline: g.discipline,
  target_index: g.targetIndex,
  target_date: g.targetDate,
  done: g.done,
  created_at: g.createdAt,
});

const checkInRow = (userId: string, c: CheckIn) => ({
  user_id: userId,
  date: c.date,
  mood: c.mood,
  energy: c.energy,
  stress: c.stress,
  sleep_hours: c.sleepHours,
  pain: c.pain,
  note: c.note ?? null,
});
const priorityRow = (userId: string, p: Priority) => ({ id: p.id, user_id: userId, date: p.date, text: p.text, done: p.done });
const workoutRow = (userId: string, w: PlannedWorkout) => ({
  id: w.id,
  user_id: userId,
  date: w.date,
  type: w.type,
  title: w.title,
  duration_min: w.durationMin,
  intensity: w.intensity,
  completed: w.completed,
});

async function check<T extends { error: unknown }>(p: PromiseLike<T>) {
  const r = await p;
  if (r.error) throw r.error;
}

export const remote = {
  upsertCheckIn: (uid: string, c: CheckIn) => check(supabase.from('check_ins').upsert(checkInRow(uid, c))),
  upsertPriority: (uid: string, p: Priority) => check(supabase.from('priorities').upsert(priorityRow(uid, p))),
  deletePriority: (id: string) => check(supabase.from('priorities').delete().eq('id', id)),
  upsertWorkout: (uid: string, w: PlannedWorkout) => check(supabase.from('workouts').upsert(workoutRow(uid, w))),
  deleteWorkout: (id: string) => check(supabase.from('workouts').delete().eq('id', id)),
  updateProfile: (uid: string, p: Profile) =>
    check(
      supabase
        .from('profiles')
        .upsert({ id: uid, display_name: p.displayName, focus_activities: p.focusActivities, boulder_scale: p.boulderScale, route_scale: p.routeScale }),
    ),
  /** Save a session and its climbs (replaces the climb list). */
  async saveClimbSession(uid: string, x: ClimbSession) {
    await check(supabase.from('climb_sessions').upsert(sessionRow(uid, x)));
    await check(supabase.from('climbs').delete().eq('session_id', x.id));
    const rows = climbRows(uid, x);
    if (rows.length) await check(supabase.from('climbs').insert(rows));
  },
  deleteClimbSession: (id: string) => check(supabase.from('climb_sessions').delete().eq('id', id)),
  upsertGoal: (uid: string, g: ClimbGoal) => check(supabase.from('climb_goals').upsert(goalRow(uid, g))),
  deleteGoal: (id: string) => check(supabase.from('climb_goals').delete().eq('id', id)),
  /** Replace everything with the given data (used by "Load demo data"). */
  async replaceAll(uid: string, d: CruxData) {
    await this.clearAll(uid);
    await this.updateProfile(uid, d.profile);
    const cs = Object.values(d.checkIns).map((c) => checkInRow(uid, c));
    if (cs.length) await check(supabase.from('check_ins').insert(cs));
    if (d.priorities.length) await check(supabase.from('priorities').insert(d.priorities.map((p) => priorityRow(uid, p))));
    if (d.workouts.length) await check(supabase.from('workouts').insert(d.workouts.map((w) => workoutRow(uid, w))));
    if (d.climbSessions.length) {
      await check(supabase.from('climb_sessions').insert(d.climbSessions.map((x) => sessionRow(uid, x))));
      const climbs = d.climbSessions.flatMap((x) => climbRows(uid, x));
      if (climbs.length) await check(supabase.from('climbs').insert(climbs));
    }
    if (d.climbGoals.length) await check(supabase.from('climb_goals').insert(d.climbGoals.map((g) => goalRow(uid, g))));
  },
  /** Delete all of the user's logged data (keeps the account). */
  async clearAll(uid: string) {
    await check(supabase.from('check_ins').delete().eq('user_id', uid));
    await check(supabase.from('priorities').delete().eq('user_id', uid));
    await check(supabase.from('workouts').delete().eq('user_id', uid));
    await check(supabase.from('climb_sessions').delete().eq('user_id', uid)); // cascades to climbs
    await check(supabase.from('climb_goals').delete().eq('user_id', uid));
  },
  /** Permanently delete the account and every row it owns (server function, own account only). */
  deleteAccount: () => check(supabase.rpc('delete_my_account')),
};
