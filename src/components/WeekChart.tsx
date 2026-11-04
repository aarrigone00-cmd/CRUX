import { lastNDays, weekdayShort } from '@/lib/date';
import type { CruxData } from '@/lib/types';
import { TickHold } from './Holds';
import { cx } from './ui';

/**
 * 7-day glance, designed for a dark panel: bar = energy (1–5) from check-ins,
 * hold marker = a completed workout. Purely descriptive — it shows what was logged, not why.
 */
export function WeekChart({ data, today }: { data: CruxData; today: string }) {
  const days = lastNDays(7, today);
  const H = 96;
  return (
    <div>
      <div className="flex items-end justify-between gap-2" role="list" aria-label="Energy and workouts over the last 7 days">
        {days.map((d) => {
          const c = data.checkIns[d];
          const trained = data.workouts.some((w) => w.date === d && w.completed);
          const h = c ? (c.energy / 5) * H : 0;
          const isToday = d === today;
          const label = `${new Date(d + 'T12:00').toLocaleDateString(undefined, { weekday: 'long' })}: ${c ? `energy ${c.energy} of 5` : 'no check-in'}${trained ? ', workout completed' : ''}`;
          return (
            <div key={d} role="listitem" aria-label={label} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full max-w-10 items-end bg-bone-50/[0.06]" style={{ height: H }}>
                <div
                  className={cx('w-full ', isToday ? 'bg-mustard-300' : 'bg-bone-100/85')}
                  style={{ height: h, transition: 'height 500ms ease' }}
                />
              </div>
              <span className="grid h-3.5 place-items-center">{trained && <TickHold className="h-3.5 w-3.5" color="#f6d76b" />}</span>
              <span className={cx('font-mono text-[0.65rem]', isToday ? 'text-mustard-300' : 'text-bone-100/55')}>{weekdayShort(d)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.62rem] tracking-[0.1em] text-bone-100/70 uppercase">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-bone-100/85" /> Energy (1–5)</span>
        <span className="flex items-center gap-1.5"><TickHold className="h-3 w-3" color="#f6d76b" /> Session sent</span>
      </div>
    </div>
  );
}
