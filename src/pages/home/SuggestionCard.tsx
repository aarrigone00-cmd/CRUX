import type { ReactNode } from 'react';
import type { Suggestion, Tone } from '@/lib/suggestions';
import { SectionHeader, cx } from '@/components/ui';

const marker: Record<Tone, string> = {
  moss: 'bg-sky-300',
  mauve: 'bg-mustard-300',
  clay: 'bg-oxblood-500',
  bone: 'bg-ink-300',
};

export function SuggestionCard({ title, eyebrow, items, footnote }: { title: string; eyebrow: string; icon?: ReactNode; items: Suggestion[]; footnote?: string; tone?: Tone }) {
  return (
    <section className="card" aria-label={title}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <ol>
        {items.map((s, i) => (
          <li key={s.id} className="flex gap-3 border-b border-ink-900/10 py-3 first:pt-0">
            <span className="flex flex-col items-center gap-1.5 pt-1">
              <span className="font-mono text-[0.62rem] text-ink-500">{String(i + 1).padStart(2, '0')}</span>
              <span aria-hidden className={cx('h-2 w-2', marker[s.tone])} />
            </span>
            <span>
              <span className="block font-semibold text-ink-900">{s.title}</span>
              <span className="mt-0.5 block text-[0.95rem] text-ink-700">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
      {footnote && <p className="mt-3 pr-12 font-display text-sm text-ink-500 italic">{footnote}</p>}
    </section>
  );
}
