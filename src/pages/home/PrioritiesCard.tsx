import { useState } from 'react';
import { Check, ListChecks, X } from 'lucide-react';
import { MAX_PRIORITIES, useStore } from '@/data/store';
import { ProgressRing, SectionHeader, cx } from '@/components/ui';

/** ADHD-friendly: a hard cap of three. Fewer, clearer, finishable. */
export function PrioritiesCard() {
  const { data, today, addPriority, togglePriority, removePriority } = useStore();
  const [text, setText] = useState('');
  const items = data.priorities.filter((p) => p.date === today);
  const done = items.filter((p) => p.done).length;
  const full = items.length >= MAX_PRIORITIES;

  return (
    <section className="card" aria-label="Daily priorities">
      <SectionHeader
        eyebrow="Top three"
        title="Today’s priorities"
        icon={<ListChecks size={20} aria-hidden />}
        action={items.length > 0 && <ProgressRing value={done} max={items.length} size={48} label={`${done} of ${items.length} priorities done`} />}
      />
      {items.length === 0 && <p className="mb-3 text-charcoal-600">What are the three things that would make today a win? Small is fine.</p>}
      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="group flex items-center gap-3 rounded-2xl bg-cream-200/50 p-2 pr-1">
            <button
              onClick={() => togglePriority(p.id)}
              aria-pressed={p.done}
              aria-label={`${p.done ? 'Mark not done' : 'Mark done'}: ${p.text}`}
              className={cx(
                'grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors',
                p.done ? 'border-sage-600 bg-sage-600 text-white' : 'border-sage-300 bg-white text-transparent hover:border-sage-500',
              )}
            >
              <Check size={18} strokeWidth={3} aria-hidden />
            </button>
            <span className={cx('flex-1', p.done && 'text-charcoal-400 line-through')}>{p.text}</span>
            <button onClick={() => removePriority(p.id)} aria-label={`Remove ${p.text}`} className="grid h-9 w-9 place-items-center rounded-full text-charcoal-400 hover:bg-cream-300 hover:text-charcoal-700">
              <X size={16} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      {!full ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addPriority(text);
            setText('');
          }}
        >
          <label htmlFor="new-priority" className="sr-only">New priority</label>
          <input id="new-priority" className="input" placeholder={`Add priority ${items.length + 1} of ${MAX_PRIORITIES}`} value={text} onChange={(e) => setText(e.target.value)} maxLength={80} />
          <button className="btn-primary px-4" disabled={!text.trim()}>Add</button>
        </form>
      ) : (
        <p className="mt-3 text-sm text-charcoal-500">Three is the limit — finish or remove one to add another.</p>
      )}
      {items.length > 0 && done === items.length && <p className="mt-3 font-semibold text-sage-700">All done. That’s a win. 🌿</p>}
    </section>
  );
}
