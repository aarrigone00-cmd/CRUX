import { addDays, fromISO, todayISO } from './date';
import { isBoulder, isSend, type ClimbGoal, type ClimbSession, type ISODate } from './types';
import type { GradeKind } from './grades';

/**
 * Descriptive climbing statistics. These summarise what was logged;
 * they don't explain *why* performance changed (correlation ≠ causation).
 */
export interface Send {
  date: ISODate;
  kind: GradeKind;
  gradeIndex: number;
  outcome: string;
}

export const kindOf = (s: ClimbSession): GradeKind => (isBoulder(s.discipline) ? 'boulder' : 'route');

export function allSends(sessions: ClimbSession[]): Send[] {
  return sessions.flatMap((s) =>
    s.climbs.filter((c) => isSend(c.outcome)).map((c) => ({ date: s.date, kind: kindOf(s), gradeIndex: c.gradeIndex, outcome: c.outcome })),
  );
}

export function hardest(sends: Send[], kind: GradeKind, sinceDays?: number): number | null {
  const since = sinceDays ? addDays(todayISO(), -sinceDays) : '';
  const xs = sends.filter((s) => s.kind === kind && s.date >= since).map((s) => s.gradeIndex);
  return xs.length ? Math.max(...xs) : null;
}

/** Sends per grade within a window, hardest first — the classic grade pyramid. */
export function pyramid(sends: Send[], kind: GradeKind, sinceDays = 90): Array<{ gradeIndex: number; count: number; flashes: number }> {
  const since = addDays(todayISO(), -sinceDays);
  const map = new Map<number, { count: number; flashes: number }>();
  for (const s of sends) {
    if (s.kind !== kind || s.date < since) continue;
    const e = map.get(s.gradeIndex) ?? { count: 0, flashes: 0 };
    e.count += 1;
    if (s.outcome === 'flash' || s.outcome === 'onsight') e.flashes += 1;
    map.set(s.gradeIndex, e);
  }
  return [...map.entries()].map(([gradeIndex, v]) => ({ gradeIndex, ...v })).sort((a, b) => b.gradeIndex - a.gradeIndex);
}

/** Hardest send per calendar month for the last `months` months (null where nothing was sent). */
export function monthlyHardest(sends: Send[], kind: GradeKind, months = 6): Array<{ label: string; key: string; value: number | null }> {
  const now = fromISO(todayISO());
  const out: Array<{ label: string; key: string; value: number | null }> = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const xs = sends.filter((s) => s.kind === kind && s.date.startsWith(key)).map((s) => s.gradeIndex);
    out.push({ key, label: d.toLocaleDateString(undefined, { month: 'short' }), value: xs.length ? Math.max(...xs) : null });
  }
  return out;
}

export function sessionsThisMonth(sessions: ClimbSession[]): number {
  const key = todayISO().slice(0, 7);
  return sessions.filter((s) => s.date.startsWith(key)).length;
}

export function sendRate(sessions: ClimbSession[], sinceDays = 30): number | null {
  const since = addDays(todayISO(), -sinceDays);
  const climbs = sessions.filter((s) => s.date >= since).flatMap((s) => s.climbs);
  if (!climbs.length) return null;
  return Math.round((climbs.filter((c) => isSend(c.outcome)).length / climbs.length) * 100);
}

/** A goal is met when there's a send at or above its target grade logged after the goal was set. */
export function goalMet(goal: ClimbGoal, sends: Send[]): Send | undefined {
  const since = goal.createdAt.slice(0, 10);
  return sends.find((s) => s.kind === goal.discipline && s.gradeIndex >= goal.targetIndex && s.date >= since);
}
