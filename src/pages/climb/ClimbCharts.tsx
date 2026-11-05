import { gradeLabel, type GradeKind } from '@/lib/grades';
import { monthlyHardest, pyramid, type Send } from '@/lib/climbStats';
import type { Profile } from '@/lib/types';

/** Grade pyramid: sends per grade (last 90 days), widest at the base. Solid = sent after work, light = flash/onsight. */
export function Pyramid({ sends, kind, profile }: { sends: Send[]; kind: GradeKind; profile: Profile }) {
  const rows = pyramid(sends, kind);
  if (!rows.length) return <p className="py-6 text-ink-500">No {kind === 'boulder' ? 'boulder' : 'route'} sends in the last 90 days yet.</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <div role="list" aria-label={`Grade pyramid, ${kind}s, last 90 days`} className="space-y-1.5">
      {rows.map((r) => {
        const label = gradeLabel(kind, r.gradeIndex, profile.boulderScale, profile.routeScale);
        const w = (r.count / max) * 100;
        const fw = (r.flashes / max) * 100;
        return (
          <div key={r.gradeIndex} role="listitem" aria-label={`${label}: ${r.count} sends, ${r.flashes} first try`} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3">
            <span className="text-right font-poster text-lg">{label}</span>
            <div className="flex h-7 justify-center">
              <div className="relative flex h-full justify-center bg-poster-red" style={{ width: `${w}%` }}>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-mustard-300" style={{ width: `${(fw / w) * 100}%` }} />
              </div>
            </div>
            <span className="font-mono text-sm text-ink-500">{r.count}</span>
          </div>
        );
      })}
      <div className="flex gap-4 pt-2 text-sm text-ink-600">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-mustard-300" /> First try (flash / onsight)</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-poster-red" /> Sent after work</span>
      </div>
    </div>
  );
}

/** Hardest send per month (last 6 months) as a stepped poster chart. */
export function Progression({ sends, kind, profile }: { sends: Send[]; kind: GradeKind; profile: Profile }) {
  const pts = monthlyHardest(sends, kind);
  const vals = pts.map((p) => p.value).filter((v): v is number => v !== null);
  if (!vals.length) return <p className="py-6 text-ink-500">Log a few sends to see your progression.</p>;
  const lo = Math.max(0, Math.min(...vals) - 1);
  const hi = Math.max(...vals) + 1;
  const W = 600;
  const H = 220;
  const pad = { l: 56, r: 16, t: 16, b: 34 };
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (pts.length - 1);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((_, i, a) => a.length <= 7 || i % 2 === 0);
  const path = pts
    .map((p, i) => (p.value === null ? null : `${x(i)},${y(p.value)}`))
    .filter(Boolean)
    .join(' L ');
  const label = (v: number) => gradeLabel(kind, v, profile.boulderScale, profile.routeScale);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Hardest ${kind} send per month: ${pts.map((p) => `${p.label} ${p.value === null ? 'none' : label(p.value)}`).join(', ')}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity="0.1" />
            <text x={pad.l - 10} y={y(t) + 5} textAnchor="end" className="fill-ink-500 font-poster" fontSize="14">{label(t)}</text>
          </g>
        ))}
        {path && <path d={`M ${path}`} fill="none" stroke="var(--color-poster-red)" strokeWidth="4" strokeLinejoin="round" />}
        {pts.map((p, i) => (
          <g key={p.key}>
            {p.value !== null && <rect x={x(i) - 6} y={y(p.value) - 6} width="12" height="12" fill="var(--color-ink-900)" />}
            <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-ink-500 font-poster uppercase" fontSize="13" letterSpacing="1">{p.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-sm text-ink-500">Hardest logged send each month. A description of your log — not a measure of why it changed.</figcaption>
    </figure>
  );
}
