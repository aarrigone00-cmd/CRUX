import { addDays, todayISO, uid } from '@/lib/date';
import type { CheckIn, Climb, ClimbOutcome, ClimbSession, CruxData, PlannedWorkout, Scale } from '@/lib/types';

export const emptyData = (): CruxData => ({
  version: 1,
  profile: { displayName: '', focusActivities: ['Bouldering', 'Strength', 'Yoga'], boulderScale: 'V', routeScale: 'YDS' },
  checkIns: {},
  priorities: [],
  workouts: [],
  climbSessions: [],
  climbGoals: [],
});

/** ~10 weeks of climbing that slowly trends upward, for demos. */
function demoClimbing(today: string): Pick<CruxData, 'climbSessions' | 'climbGoals'> {
  const c = (gradeIndex: number, outcome: ClimbOutcome, attempts = 1, name = ''): Climb => ({ id: uid(), name, gradeIndex, attempts, outcome, notes: '' });
  const s = (
    daysAgo: number,
    discipline: ClimbSession['discipline'],
    setting: ClimbSession['setting'],
    location: string,
    durationMin: number,
    climbs: Climb[],
    notes = '',
  ): ClimbSession => ({ id: uid(), date: addDays(today, -daysAgo), discipline, setting, location, durationMin, notes, climbs });

  return {
    climbSessions: [
      s(68, 'boulder', 'indoor', 'The Crag Gym', 90, [c(2, 'flash'), c(3, 'flash'), c(3, 'redpoint', 3), c(4, 'project', 5)]),
      s(61, 'sport', 'indoor', 'The Crag Gym', 100, [c(4, 'onsight'), c(5, 'redpoint', 2), c(6, 'project', 3)]),
      s(54, 'boulder', 'indoor', 'The Crag Gym', 80, [c(3, 'flash'), c(4, 'redpoint', 4), c(4, 'redpoint', 2), c(5, 'project', 6)], 'Heel hooks felt good today.'),
      s(47, 'boulder', 'outdoor', 'Joshua Tree', 180, [c(2, 'flash', 1, 'Pigs in Space'), c(3, 'redpoint', 3), c(4, 'project', 4)], 'Granite is sharp — tape up next time.'),
      s(40, 'sport', 'indoor', 'The Crag Gym', 90, [c(5, 'onsight'), c(6, 'redpoint', 3), c(7, 'project', 2)]),
      s(33, 'boulder', 'indoor', 'The Crag Gym', 75, [c(4, 'flash'), c(4, 'flash'), c(5, 'redpoint', 5)]),
      s(26, 'boulder', 'indoor', 'Boulder Barn', 90, [c(3, 'flash'), c(5, 'redpoint', 3), c(6, 'project', 7, 'Blue overhang')]),
      s(19, 'sport', 'outdoor', 'Smith Rock', 240, [c(5, 'onsight', 1, 'Five Gallon Buckets'), c(6, 'redpoint', 2), c(7, 'redpoint', 4)], 'First outdoor 5.10c!'),
      s(12, 'boulder', 'indoor', 'The Crag Gym', 90, [c(4, 'flash'), c(5, 'flash'), c(6, 'redpoint', 6, 'Blue overhang')], 'Sent the blue overhang project.'),
      s(5, 'boulder', 'indoor', 'The Crag Gym', 85, [c(4, 'flash'), c(5, 'redpoint', 2), c(6, 'redpoint', 3), c(7, 'project', 4)]),
      s(2, 'top_rope', 'indoor', 'The Crag Gym', 60, [c(3, 'onsight'), c(4, 'onsight'), c(6, 'onsight')], 'Easy mileage day.'),
    ],
    climbGoals: [
      { id: uid(), title: 'Send my first V5', discipline: 'boulder', targetIndex: 6, targetDate: addDays(today, 30), done: false, createdAt: new Date(Date.now() - 70 * 864e5).toISOString() },
      { id: uid(), title: 'Lead a 5.11a outdoors', discipline: 'route', targetIndex: 9, targetDate: addDays(today, 120), done: false, createdAt: new Date(Date.now() - 30 * 864e5).toISOString() },
    ],
  };
}

/** Realistic-looking sample data for demos. Clearly labelled as demo data in the UI. */
export function demoData(): CruxData {
  const today = todayISO();
  const pattern: Array<[Scale, Scale, Scale, number]> = [
    [4, 3, 2, 7.5],
    [3, 2, 4, 5.5],
    [3, 3, 3, 6.5],
    [4, 4, 2, 8],
    [5, 4, 2, 7.5],
    [3, 3, 3, 7],
  ];
  const checkIns: Record<string, CheckIn> = {};
  pattern.forEach(([mood, energy, stress, sleepHours], i) => {
    const date = addDays(today, i - pattern.length);
    checkIns[date] = { date, mood, energy, stress, sleepHours, pain: [], updatedAt: new Date().toISOString() };
  });

  const w = (offset: number, type: PlannedWorkout['type'], title: string, durationMin: number, intensity: PlannedWorkout['intensity'], completed: boolean): PlannedWorkout => ({
    id: uid(), date: addDays(today, offset), type, title, durationMin, intensity, completed,
  });

  return {
    version: 1,
    profile: { displayName: 'Alex', focusActivities: ['Bouldering', 'Strength', 'Yoga'], boulderScale: 'V', routeScale: 'YDS' },
    ...demoClimbing(today),
    checkIns,
    priorities: [
      { id: uid(), date: today, text: 'Submit lab report', done: false },
      { id: uid(), date: today, text: 'Pack climbing bag', done: true },
      { id: uid(), date: today, text: 'Groceries for the week', done: false },
    ],
    workouts: [
      w(-6, 'Bouldering', 'Limit bouldering', 90, 'hard', true),
      w(-5, 'Yoga', 'Flow + hips', 40, 'easy', true),
      w(-3, 'Strength', 'Pull + core', 50, 'moderate', true),
      w(-2, 'Running', 'Easy loop', 30, 'easy', false),
      w(-1, 'Rope climbing', 'Endurance laps', 75, 'moderate', true),
      w(0, 'Bouldering', 'Technique: footwork drills', 75, 'moderate', false),
      w(0, 'Mobility', 'Post-session stretch', 15, 'easy', false),
    ],
  };
}
