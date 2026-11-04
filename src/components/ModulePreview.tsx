import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { Ridge } from './Ridge';
import { ClimbingWall } from './ClimbingWall';

/** Honest placeholder for modules that ship in Phase 3. */
export function ModulePreview({
  name,
  tagline,
  icon,
  features,
  principle,
  accent = 'moss',
  art = 'ridge',
}: {
  art?: 'ridge' | 'wall';
  name: string;
  tagline: string;
  icon: ReactNode;
  features: string[];
  principle?: string;
  accent?: 'moss' | 'mauve' | 'clay';
}) {
  const tint = { moss: 'from-moss-800/80', mauve: 'from-mauve-700/80', clay: 'from-oxblood-700/80' }[accent];
  return (
    <div className="rise space-y-5">
      <header className="grain relative isolate overflow-hidden rounded-[var(--radius-card)] bg-ink-900 p-6 text-bone-50 shadow-[var(--shadow-lift)] sm:p-9">
        {art === 'wall' ? (
          <ClimbingWall className="absolute inset-0 -z-10 bg-gradient-to-br from-clay-700 to-oxblood-700" />
        ) : (
          <Ridge id={`mod-${name}`} align="xMidYMax" climber={false} className="absolute inset-0 -z-10 h-full w-full" />
        )}
        <div className={`absolute inset-0 -z-10 bg-gradient-to-r ${tint} via-ink-900/60 to-transparent`} aria-hidden />
        <span className="grid h-12 w-12 place-items-center hold-blob bg-bone-50/15 text-ochre-200 backdrop-blur">{icon}</span>
        <p className="mt-10 text-[0.7rem] font-semibold tracking-[0.24em] text-ochre-200 uppercase">CRUX</p>
        <h1 className="display-italic text-5xl font-medium text-bone-50 sm:text-6xl">{name.charAt(0) + name.slice(1).toLowerCase()}</h1>
        <p className="mt-2 max-w-sm text-bone-100/85">{tagline}</p>
        <span className="mt-5 inline-block rounded-full border border-bone-50/25 px-3 py-1 text-xs font-semibold tracking-wide text-bone-100">In development · Phase 3</span>
      </header>
      <section className="card">
        <h2 className="display-italic text-2xl font-medium">What’s coming</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-ink-700">
              <Check size={18} className="mt-1 shrink-0 text-clay-500" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </section>
      {principle && (
        <section className="rounded-[var(--radius-card)] border-l-4 border-clay-500 bg-bone-200/60 p-5">
          <h2 className="eyebrow">Our approach</h2>
          <p className="mt-1 text-ink-700">{principle}</p>
        </section>
      )}
    </div>
  );
}
