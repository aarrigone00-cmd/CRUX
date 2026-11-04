import { addDays } from './date';
import type { CheckIn, PainArea, PlannedWorkout } from './types';

/**
 * Rule-based daily suggestions. Deliberately conservative:
 *  - general wellness guidance only, never diagnoses or medication advice
 *  - never infers hormones or performance from menstrual cycle dates
 *  - no specific nutrient numbers (verified food data arrives with CRUX FUEL)
 *  - pain always narrows what we suggest and points to a professional if it persists
 */

export type Tone = 'sage' | 'lavender' | 'rose' | 'cream';

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  tone: Tone;
}

const PAIN_GUIDANCE: Record<PainArea, string> = {
  Fingers: 'Skip hangboarding, campusing and small crimps. Favour big holds, slab/footwork drills, or non-finger training.',
  Wrists: 'Avoid loaded wrist extension (planks, push-ups, slopers). Try forearm-supported variations instead.',
  Elbows: 'Ease off steep pulling and lock-offs. Keep volume low and stop if it sharpens.',
  Shoulders: 'Avoid overhead loading and wide gastons. Choose vertical terrain and gentle range-of-motion work.',
  Neck: 'Limit belaying with your head tilted back for long periods; belay glasses can help. Keep movements gentle.',
  'Lower back': 'Skip heavy hinging and big drop-knees. Gentle walking or supported mobility may feel better.',
  Hips: 'Avoid forcing deep high-steps and frog positions. Stay within a comfortable range.',
  Knees: 'Avoid heel hooks, deep drop-knees and jumping down from boulders. Downclimb or use the descent.',
  Ankles: 'Avoid jumping off boulders and running on uneven ground. Downclimb and choose stable surfaces.',
};

export function recoverySuggestions(
  checkIn: CheckIn | undefined,
  workouts: PlannedWorkout[],
  today: string,
): Suggestion[] {
  if (!checkIn) {
    return [
      {
        id: 'checkin',
        title: 'Check in to tailor today',
        body: 'Log mood, energy, sleep and any pain. Suggestions adapt to how you actually feel — not to a calendar.',
        tone: 'cream',
      },
    ];
  }

  const out: Suggestion[] = [];

  if (checkIn.pain.length) {
    checkIn.pain.forEach((area) =>
      out.push({ id: `pain-${area}`, title: `Go easy on your ${area.toLowerCase()}`, body: PAIN_GUIDANCE[area], tone: 'rose' }),
    );
    out.push({
      id: 'pain-pro',
      title: 'Pain that lingers deserves attention',
      body: 'If pain is sharp, swelling, getting worse, or lasts more than a few days, see a physiotherapist or doctor before training through it.',
      tone: 'rose',
    });
  }

  if (checkIn.sleepHours > 0 && checkIn.sleepHours < 6) {
    out.push({
      id: 'sleep',
      title: 'Short night',
      body: 'With less sleep, a longer warm-up and moderate intensity may feel better. A short nap or earlier night can help tomorrow.',
      tone: 'lavender',
    });
  }

  if (checkIn.energy <= 2) {
    out.push({
      id: 'energy',
      title: 'Low energy is useful information',
      body: 'A lighter session, mobility, or a walk still counts. You can always do more once you are warmed up — or call it a rest day.',
      tone: 'lavender',
    });
  }

  if (checkIn.stress >= 4) {
    out.push({
      id: 'stress',
      title: 'Take the edge off',
      body: 'Try 3–5 minutes of slow breathing (longer exhale than inhale) before training or your next task.',
      tone: 'lavender',
    });
  }

  const yesterdayHard = workouts.some((w) => w.date === addDays(today, -1) && w.completed && w.intensity === 'hard');
  if (yesterdayHard) {
    out.push({
      id: 'after-hard',
      title: 'Recovering from a hard session',
      body: 'Yesterday was intense. Prioritise a proper meal, water and gentle mobility; save max efforts for when you feel fresh.',
      tone: 'sage',
    });
  }

  if (!out.length) {
    out.push({
      id: 'good',
      title: 'Feeling steady',
      body: 'Warm up progressively, build intensity gradually, and finish with a few minutes of stretching.',
      tone: 'sage',
    });
  }

  return out;
}

export function fuelReminders(todaysWorkouts: PlannedWorkout[]): Suggestion[] {
  const upcoming = todaysWorkouts.filter((w) => !w.completed);
  const done = todaysWorkouts.filter((w) => w.completed);
  const out: Suggestion[] = [];

  if (upcoming.length) {
    const first = upcoming[0];
    out.push({
      id: 'pre',
      title: `Before ${first.title || first.type}`,
      body: 'Have a meal or snack with carbohydrates and some protein a couple of hours beforehand, or something light and easy closer to the session.',
      tone: 'sage',
    });
    out.push({ id: 'water', title: 'Pack water', body: 'Put a filled bottle in your bag now so future-you does not have to remember.', tone: 'cream' });
  }

  if (done.length || upcoming.length) {
    out.push({
      id: 'post',
      title: 'After training',
      body: 'Plan a meal with protein and carbohydrates in the hours after. A pre-decided “default” recovery meal removes a decision.',
      tone: 'lavender',
    });
  } else {
    out.push({
      id: 'rest',
      title: 'Rest days need fuel too',
      body: 'Regular meals support recovery. Set a reminder for lunch if hyperfocus tends to make you skip it.',
      tone: 'sage',
    });
  }

  out.push({
    id: 'snack',
    title: 'Grab-and-go backup',
    body: 'Keep one no-prep snack in your bag or desk for days that get away from you.',
    tone: 'cream',
  });

  return out;
}
