import { ArrowDown, Dumbbell, ListChecks, Moon, Smile, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useStore } from '@/data/store';
import { formatLongDate, greeting } from '@/lib/date';
import { Ridge } from '@/components/Ridge';

const MOOD = ['Very low', 'Low', 'Okay', 'Good', 'Great'];
const ENERGY = ['Drained', 'Low', 'Steady', 'Strong', 'Charged'];

export function Hero() {
  const { data, today, todayCheckIn: c } = useStore();
  const name = data.profile.displayName.trim();
  const workouts = data.workouts.filter((w) => w.date === today);
  const priorities = data.priorities.filter((p) => p.date === today);

  return (
    <header className="grain relative isolate min-h-[26rem] overflow-hidden rounded-[var(--radius-card)] bg-ink-900 text-bone-50 shadow-[var(--shadow-lift)] sm:min-h-[30rem]">
      <Ridge id="hero" align="xMaxYMax" className="absolute inset-0 -z-10 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-ink-900/30" aria-hidden />

      <div className="flex h-full min-h-[26rem] flex-col justify-between p-5 sm:min-h-[30rem] sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.7rem] font-semibold tracking-[0.24em] text-ochre-200 uppercase">{formatLongDate()}</p>
          <p className="hidden text-[0.7rem] font-semibold tracking-[0.24em] text-bone-100/70 uppercase sm:block">Train · Fuel · Thrive</p>
        </div>

        <div>
          <h1 className="display-italic max-w-[12ch] text-[2.6rem] leading-[1.02] font-medium text-bone-50 sm:text-7xl">
            {greeting()}
            {name && <span className="text-ochre-200">, {name}</span>}
          </h1>
          <p className="mt-3 max-w-sm text-bone-100/85">
            {c ? 'Here’s your line for today.' : 'Chalk up with a 30-second check-in — everything below adapts to how you feel.'}
          </p>

          {c ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              <Stat icon={<Smile size={15} />} label={MOOD[c.mood - 1]} />
              <Stat icon={<Zap size={15} />} label={`${ENERGY[c.energy - 1]} energy`} />
              <Stat icon={<Moon size={15} />} label={`${c.sleepHours} h sleep`} />
              {workouts.length > 0 && <Stat icon={<Dumbbell size={15} />} label={`${workouts.filter((w) => w.completed).length}/${workouts.length} sessions`} />}
              {priorities.length > 0 && <Stat icon={<ListChecks size={15} />} label={`${priorities.filter((p) => p.done).length}/${priorities.length} priorities`} />}
            </ul>
          ) : (
            <a href="#checkin" className="btn mt-5 bg-bone-50 text-ink-900 hover:bg-ochre-100">
              Chalk up <ArrowDown size={16} aria-hidden />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

function Stat({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-1.5 rounded-full border border-bone-50/20 bg-ink-900/35 px-3 py-1.5 text-sm font-semibold text-bone-50 backdrop-blur-md">
      <span aria-hidden className="text-ochre-200">{icon}</span>
      {label}
    </li>
  );
}
