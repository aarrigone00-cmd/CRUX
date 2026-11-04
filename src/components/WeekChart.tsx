import { lastNDays, weekdayShort } from '@/lib/date';
import type { CruxData } from '@/lib/types';
import { cx } from './ui';

/**
 * 7-day glance: bar = energy (1–5) from check-ins, dot = a completed workout.
 * Purely descriptive — it shows what was logged, not why.
 */
export function WeekChart({ data, today }: { data: CruxData; today: string }) {
  const days = lastNDays(7, today);
  const H = 72;
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
            <div key={d} role="listitem" aria-label={label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="relative flex w-full max-w-9 items-end rounded-lg bg-cream-200" style={{ height: H }}>
                <div
                  className={cx('w-full rounded-lg', isToday ? 'bg-sage-600' : 'bg-sage-300')}
                  style={{ height: h, transition: 'height 400ms ease' }}
                />
              </div>
              <span className={cx('h-1.5 w-1.5 rounded-full', trained ? 'bg-rose-400' : 'bg-transparent')} />
              <span className={cx('text-xs', isToday ? 'font-bold text-charcoal-800' : 'text-charcoal-500')}>{weekdayShort(d)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-sage-300" /> Energy (1–5)</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Workout done</span>
      </div>
    </div>
  );
}
