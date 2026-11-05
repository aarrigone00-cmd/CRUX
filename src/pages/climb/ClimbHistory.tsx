import { useState } from 'react';
import { ChevronDown, MapPin, Trash2 } from 'lucide-react';
import { useStore } from '@/data/store';
import { gradeLabel } from '@/lib/grades';
import { kindOf } from '@/lib/climbStats';
import { DISCIPLINES, isBoulder, isSend } from '@/lib/types';
import { fromISO } from '@/lib/date';
import { Pill, SectionHeader, cx } from '@/components/ui';
import { outcomeLabel } from './LogSession';

export function ClimbHistory() {
  const { data, deleteClimbSession } = useStore();
  const { boulderScale, routeScale } = data.profile;
  const [open, setOpen] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const sessions = [...data.climbSessions].reverse();
  const shown = showAll ? sessions : sessions.slice(0, 6);

  return (
    <section className="card" aria-label="Session history">
      <SectionHeader eyebrow={`${sessions.length} logged`} title="Session history" />
      {!sessions.length && <p className="text-ink-600">No sessions yet — log your first one above.</p>}
      <ol className="divide-y divide-ink-900/10 border-y border-ink-900/10">
        {shown.map((s) => {
          const kind = kindOf(s);
          const sent = s.climbs.filter((c) => isSend(c.outcome));
          const top = sent.length ? Math.max(...sent.map((c) => c.gradeIndex)) : null;
          const isOpen = open === s.id;
          return (
            <li key={s.id}>
              <button className="flex w-full items-center gap-3 py-3 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                <span className="w-14 shrink-0 font-poster text-lg leading-none">
                  {fromISO(s.date).toLocaleDateString(undefined, { day: 'numeric' })}
                  <span className="block text-xs tracking-[0.12em] text-ink-500 uppercase">{fromISO(s.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{DISCIPLINES.find((d) => d.id === s.discipline)?.label} · {s.setting}</span>
                  <span className="flex items-center gap-1 truncate text-sm text-ink-500">
                    {s.location && (
                      <>
                        <MapPin size={12} aria-hidden /> {s.location} ·{' '}
                      </>
                    )}
                    {sent.length}/{s.climbs.length} sent{s.durationMin ? ` · ${s.durationMin} min` : ''}
                  </span>
                </span>
                {top !== null && <span className="font-poster text-2xl text-poster-red">{gradeLabel(kind, top, boulderScale, routeScale)}</span>}
                <ChevronDown size={18} aria-hidden className={cx('shrink-0 transition-transform', isOpen && 'rotate-180')} />
              </button>
              {isOpen && (
                <div className="pb-4 pl-[4.25rem]">
                  {s.climbs.length > 0 && (
                    <ul className="mb-3 flex flex-wrap gap-2">
                      {s.climbs.map((c) => (
                        <li key={c.id} className="flex items-center gap-2 border border-ink-900/15 px-2.5 py-1">
                          <span className="font-poster text-lg">{gradeLabel(kind, c.gradeIndex, boulderScale, routeScale)}</span>
                          <Pill tone={c.outcome === 'project' ? 'bone' : c.outcome === 'flash' || c.outcome === 'onsight' ? 'mauve' : 'clay'}>
                            {outcomeLabel(c.outcome, isBoulder(s.discipline))}
                          </Pill>
                          {c.attempts > 1 && <span className="text-xs text-ink-500">×{c.attempts}</span>}
                          {c.name && <span className="text-sm text-ink-600">{c.name}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.notes && <p className="mb-3 text-ink-700">“{s.notes}”</p>}
                  <button className="btn-ghost min-h-9 px-0 text-oxblood-500" onClick={() => deleteClimbSession(s.id)}>
                    <Trash2 size={14} aria-hidden /> Delete session
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {sessions.length > 6 && (
        <button className="btn-ghost mt-3 px-0" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show fewer' : `Show all ${sessions.length}`}
        </button>
      )}
    </section>
  );
}
