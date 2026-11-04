import { addDays, todayISO, uid } from '@/lib/date';
import type { CheckIn, CruxData, PlannedWorkout, Scale } from '@/lib/types';

export const emptyData = (): CruxData => ({
  version: 1,
  profile: { displayName: '', focusActivities: ['Bouldering', 'Strength', 'Yoga'] },
  checkIns: {},
  priorities: [],
  workouts: [],
});

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
    profile: { displayName: 'Alex', focusActivities: ['Bouldering', 'Strength', 'Yoga'] },
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
