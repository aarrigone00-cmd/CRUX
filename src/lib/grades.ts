/**
 * Climbing grades. Each discipline is stored as an index on one canonical scale:
 *  - boulders → V-scale (VB, V0 … V17)
 *  - routes   → YDS (5.5 … 5.15d)
 * and displayed in the user's preferred system. Cross-system equivalents are
 * approximate (commonly used conversion charts), and the UI says so.
 */
export type BoulderScale = 'V' | 'Font';
export type RouteScale = 'YDS' | 'French';
export type GradeKind = 'boulder' | 'route';

const V = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
const FONT = ['3', '4', '5', '5+', '6A', '6B', '6C', '7A', '7A+', '7B', '7C', '7C+', '8A', '8A+', '8B', '8B+', '8C', '8C+', '9A'];

const YDS = [
  '5.5', '5.6', '5.7', '5.8', '5.9',
  '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d',
  '5.12a', '5.12b', '5.12c', '5.12d',
  '5.13a', '5.13b', '5.13c', '5.13d',
  '5.14a', '5.14b', '5.14c', '5.14d',
  '5.15a', '5.15b', '5.15c', '5.15d',
];
const FRENCH = [
  '4b', '4c', '5a', '5b', '5c',
  '6a', '6a+', '6b', '6b+',
  '6c', '6c+', '6c+/7a', '7a',
  '7a+', '7b', '7b+', '7c',
  '7c+', '8a', '8a+', '8b',
  '8b+', '8c', '8c+', '9a',
  '9a+', '9b', '9b+', '9c',
];

export function gradeLabels(kind: GradeKind, boulder: BoulderScale, route: RouteScale): string[] {
  if (kind === 'boulder') return boulder === 'V' ? V : FONT;
  return route === 'YDS' ? YDS : FRENCH;
}

export function gradeLabel(kind: GradeKind, index: number, boulder: BoulderScale, route: RouteScale): string {
  const list = gradeLabels(kind, boulder, route);
  return list[Math.max(0, Math.min(list.length - 1, index))];
}

export const gradeCount = (kind: GradeKind) => (kind === 'boulder' ? V.length : YDS.length);

/** Sensible starting grade for the picker. */
export const defaultGrade = (kind: GradeKind) => (kind === 'boulder' ? 4 : 5); // V3 / 5.10a
