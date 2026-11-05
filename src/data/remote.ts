import { supabase } from '@/lib/supabase';
import type { CheckIn, CruxData, PlannedWorkout, Priority, Profile } from '@/lib/types';
import { emptyData } from './demo';

/** Map between Supabase rows (snake_case) and app types. All queries are scoped by RLS to the signed-in user. */

export async function fetchAll(userId: string): Promise<CruxData> {
  const [profile, checkIns, priorities, workouts] = await Promise.all([
    supabase.from('profiles').select('display_name, focus_activities').eq('id', userId).maybeSingle(),
    supabase.from('check_ins').select('*').order('date'),
    supabase.from('priorities').select('*').order('created_at'),
    supabase.from('workouts').select('*').order('created_at'),
  ]);
  const err = profile.error || checkIns.error || priorities.error || workouts.error;
  if (err) throw err;

  const data = emptyData();
  if (profile.data) {
    data.profile = { displayName: profile.data.display_name ?? '', focusActivities: profile.data.focus_activities ?? data.profile.focusActivities };
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
  return data;
}

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
    check(supabase.from('profiles').upsert({ id: uid, display_name: p.displayName, focus_activities: p.focusActivities })),
  /** Replace everything with the given data (used by "Load demo data"). */
  async replaceAll(uid: string, d: CruxData) {
    await this.clearAll(uid);
    await this.updateProfile(uid, d.profile);
    const cs = Object.values(d.checkIns).map((c) => checkInRow(uid, c));
    if (cs.length) await check(supabase.from('check_ins').insert(cs));
    if (d.priorities.length) await check(supabase.from('priorities').insert(d.priorities.map((p) => priorityRow(uid, p))));
    if (d.workouts.length) await check(supabase.from('workouts').insert(d.workouts.map((w) => workoutRow(uid, w))));
  },
  /** Delete all of the user's logged data (keeps the account). */
  async clearAll(uid: string) {
    await check(supabase.from('check_ins').delete().eq('user_id', uid));
    await check(supabase.from('priorities').delete().eq('user_id', uid));
    await check(supabase.from('workouts').delete().eq('user_id', uid));
  },
  /** Permanently delete the account and every row it owns (server function, own account only). */
  deleteAccount: () => check(supabase.rpc('delete_my_account')),
};
