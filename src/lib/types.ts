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
  boulderScale: 'V' | 'Font';
  routeScale: 'YDS' | 'French';
}

/* ── CLIMB ─────────────────────────────────────────────── */
export type ClimbDiscipline = 'boulder' | 'sport' | 'top_rope' | 'trad';
export const DISCIPLINES: Array<{ id: ClimbDiscipline; label: string }> = [
  { id: 'boulder', label: 'Bouldering' },
  { id: 'sport', label: 'Sport' },
  { id: 'top_rope', label: 'Top rope' },
  { id: 'trad', label: 'Trad' },
];
export const isBoulder = (d: ClimbDiscipline) => d === 'boulder';

/** flash/onsight/redpoint = sent; project = not sent yet. Boulders use flash/redpoint ("send"). */
export type ClimbOutcome = 'flash' | 'onsight' | 'redpoint' | 'project';
export const isSend = (o: ClimbOutcome) => o !== 'project';

export interface Climb {
  id: string;
  name: string;
  /** Index on the canonical scale: V-scale for boulders, YDS for routes (see lib/grades). */
  gradeIndex: number;
  attempts: number;
  outcome: ClimbOutcome;
  notes: string;
}

export interface ClimbSession {
  id: string;
  date: ISODate;
  discipline: ClimbDiscipline;
  setting: 'indoor' | 'outdoor';
  location: string;
  durationMin: number | null;
  notes: string;
  climbs: Climb[];
}

export interface ClimbGoal {
  id: string;
  title: string;
  discipline: 'boulder' | 'route';
  targetIndex: number;
  targetDate: ISODate | null;
  done: boolean;
  createdAt: string;
}

export interface CruxData {
  version: 1;
  profile: Profile;
  checkIns: Record<ISODate, CheckIn>;
  priorities: Priority[];
  workouts: PlannedWorkout[];
  climbSessions: ClimbSession[];
  climbGoals: ClimbGoal[];
}
