import type { ReactNode } from 'react';
import type { Suggestion, Tone } from '@/lib/suggestions';
import { SectionHeader, cx, toneClasses } from '@/components/ui';

export function SuggestionCard({ title, eyebrow, icon, items, footnote, tone }: { title: string; eyebrow: string; icon: ReactNode; items: Suggestion[]; footnote?: string; tone?: Tone }) {
  return (
    <section className="card" aria-label={title}>
      <SectionHeader eyebrow={eyebrow} title={title} icon={icon} tone={tone} />
      <ul className="space-y-2.5">
        {items.map((s) => (
          <li key={s.id} className={cx('rounded-2xl border p-3.5', toneClasses[s.tone])}>
            <p className="font-semibold">{s.title}</p>
            <p className="mt-0.5 text-[0.95rem] text-ink-700">{s.body}</p>
          </li>
        ))}
      </ul>
      {footnote && <p className="mt-3 text-xs text-ink-500">{footnote}</p>}
    </section>
  );
}
