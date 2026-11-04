/** Core CRUX data model. Mirrors the Supabase tables planned for Phase 2. */

export type Scale = 1 | 2 | 3 | 4 | 5;

/** ISO calendar date, e.g. "2026-11-04" (local time). */
export type ISODate = string;

export const PAIN_AREAS = ['Fingers', 'Wrists', 'Elbows', 'Shoulders', 'Neck', 'Lower back', 'Hips', 'Knees', 'Ankles'] as const;
export type PainArea = (typeof PAIN_AREAS)[number];

export interface CheckIn {
  date: ISODate;
  mood: Scale;
  energy: Scale;
  stress: Scale;
  sleepHours: number;
  /** Areas where the user reports pain or unusual soreness today. */
  pain: PainArea[];
  note?: string;
  updatedAt: string;
}

export interface Priority {
  id: string;
  date: ISODate;
  text: string;
  done: boolean;
}

export const ACTIVITY_TYPES = [
  'Bouldering',
  'Rope climbing',
  'Strength',
  'Pilates',
  'Yoga',
  'Running',
  'Cycling',
  'Mobility',
  'Other',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Intensity = 'easy' | 'moderate' | 'hard';

export interface PlannedWorkout {
  id: string;
  date: ISODate;
  type: ActivityType;
  title: string;
  durationMin: number;
  intensity: Intensity;
  completed: boolean;
}

export interface Profile {
  displayName: string;
  /** Activities the user cares about most — used to personalise suggestions. */
  focusActivities: ActivityType[];
}

export interface CruxData {
  version: 1;
  profile: Profile;
  checkIns: Record<ISODate, CheckIn>;
  priorities: Priority[];
  workouts: PlannedWorkout[];
}
