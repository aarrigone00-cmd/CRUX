import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

/** Honest placeholder for modules that ship in Phase 3. */
export function ModulePreview({
  name,
  tagline,
  icon,
  features,
  principle,
  accent = 'sage',
}: {
  name: string;
  tagline: string;
  icon: ReactNode;
  features: string[];
  principle?: string;
  accent?: 'sage' | 'lavender' | 'rose';
}) {
  const bg = { sage: 'from-sage-100 to-cream-100', lavender: 'from-lavender-100 to-cream-100', rose: 'from-rose-100 to-cream-100' }[accent];
  const iconBg = { sage: 'bg-sage-700', lavender: 'bg-lavender-600', rose: 'bg-rose-600' }[accent];
  return (
    <div className="space-y-5">
      <header className={`rounded-[var(--radius-card)] bg-gradient-to-br ${bg} p-6`}>
        <span className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${iconBg}`}>{icon}</span>
        <p className="eyebrow mt-4">CRUX</p>
        <h1 className="font-display text-3xl font-semibold">{name}</h1>
        <p className="mt-1 max-w-prose text-charcoal-600">{tagline}</p>
        <span className="mt-4 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-charcoal-600">In development · Phase 3</span>
      </header>
      <section className="card">
        <h2 className="font-display text-lg font-semibold">What’s coming</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-charcoal-700">
              <Check size={18} className="mt-1 shrink-0 text-sage-600" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </section>
      {principle && (
        <section className="rounded-[var(--radius-card)] border border-cream-300 bg-cream-200/50 p-5">
          <h2 className="eyebrow">Our approach</h2>
          <p className="mt-1 text-charcoal-700">{principle}</p>
        </section>
      )}
    </div>
  );
}
