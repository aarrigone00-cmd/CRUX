import { ArrowDown } from 'lucide-react';
import { useStore } from '@/data/store';
import { formatLongDate, greeting } from '@/lib/date';
import { Figure } from '@/components/Figure';
import { Marquee } from '@/components/Marquee';

const MOOD = ['very low', 'low', 'okay', 'good', 'great'];
const ENERGY = ['drained', 'low', 'steady', 'strong', 'charged'];

/** Home cover: statement headline, staggered figures with captions, and a ticker. */
export function Hero() {
  const { data, today, todayCheckIn: c } = useStore();
  const name = data.profile.displayName.trim() || 'you';
  const workouts = data.workouts.filter((w) => w.date === today);
  const priorities = data.priorities.filter((p) => p.date === today);

  return (
    <header className="border border-ink-900/10 bg-bone-50 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-1 border-b border-ink-900/15 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-8">
        <p className="font-display text-lg leading-tight whitespace-nowrap">
          Journal <span className="text-ink-500">(Train — <span className="font-grotesk font-semibold tracking-tight text-ink-900 uppercase">Fuel</span> — Thrive)</span>
        </p>
        <p className="eyebrow shrink-0">{formatLongDate()}</p>
      </div>

      <div className="grid gap-8 px-5 pt-7 pb-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-10">
        <div className="flex flex-col justify-between">
          <h1 className="font-grotesk text-[2.4rem] leading-[1.02] font-medium tracking-[-0.035em] text-ink-900 sm:text-[3.4rem]">
            {greeting()}, <span className="font-display font-normal tracking-normal italic">{name}</span>.{' '}
            {c ? (
              <>
                Feeling {MOOD[c.mood - 1]}, energy {ENERGY[c.energy - 1]}.
              </>
            ) : (
              <span className="text-ink-400">How are you, really?</span>
            )}
          </h1>

          {c ? (
            <dl className="mt-8 grid grid-cols-3 border-t border-ink-900/15 pt-3">
              <Index label="Sleep" value={`${c.sleepHours}h`} />
              <Index label="Sessions" value={`${workouts.filter((w) => w.completed).length}/${workouts.length}`} />
              <Index label="Priorities" value={`${priorities.filter((p) => p.done).length}/${priorities.length}`} />
            </dl>
          ) : (
            <a href="#checkin" className="btn-primary mt-8 self-start">
              Chalk up — check in <ArrowDown size={14} aria-hidden />
            </a>
          )}
        </div>

        {/* staggered plates */}
        <div className="grid grid-cols-[1.25fr_1fr] items-start gap-3 sm:gap-4">
          <Figure art="ridge" id="hero-a" index="01" caption="The crux, golden hour" frameClass="aspect-[4/5]" />
          <div className="mt-14 space-y-4 sm:mt-20">
            <Figure art="wall" id="hero-b" index="02" caption="Project, V4" frameClass="aspect-square" />
            <Figure art="ikat" id="hero-c" index="03" caption="Oxblood warp" frameClass="aspect-[5/3]" />
          </div>
        </div>
      </div>

      <Marquee items={['Train. Fuel. Thrive.', 'Chalk up', 'Rest is training too', 'Send it', 'Fuel the climb', 'Listen to your body']} />
    </header>
  );
}

function Index({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="font-display text-3xl italic">{value}</dd>
    </div>
  );
}
