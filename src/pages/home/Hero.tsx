import { ArrowDown } from 'lucide-react';
import { useStore } from '@/data/store';
import { formatLongDate, greeting } from '@/lib/date';
import { Figure } from '@/components/Figure';
import { Marquee } from '@/components/Marquee';
import { PosterWord, SpacedLetters } from '@/components/PosterWord';
import { VintagePhoto } from '@/components/VintagePhoto';
import { PHOTOS } from '@/lib/photos';

const MOOD = ['very low', 'low', 'okay', 'good', 'great'];
const ENERGY = ['drained', 'low', 'steady', 'strong', 'charged'];

/** Home cover: a screen-print poster (photo + giant condensed word) beside captioned plates. */
export function Hero() {
  const { data, today, todayCheckIn: c } = useStore();
  const name = data.profile.displayName.trim();
  const [, ...rest] = greeting().split(' ');
  const timeWord = rest.join(' ') || 'today';
  const workouts = data.workouts.filter((w) => w.date === today);
  const priorities = data.priorities.filter((p) => p.date === today);

  const blurb = c
    ? `Good ${timeWord}${name ? `, ${name}` : ''}. Feeling ${MOOD[c.mood - 1]}, energy ${ENERGY[c.energy - 1]}, ${c.sleepHours} hours of sleep. ${workouts.filter((w) => w.completed).length} of ${workouts.length} sessions sent, ${priorities.filter((p) => p.done).length} of ${priorities.length} priorities ticked. Chalk up, breathe, climb your own line — rest is training too.`
    : `Good ${timeWord}${name ? `, ${name}` : ''}. Before anything else: how are you, really? A thirty-second check-in shapes everything below — training, recovery, fuel. Not a calendar, not a guess. Your body, today. Chalk up and begin.`;

  return (
    <header className="border border-ink-900/10 bg-bone-50 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-1 border-b border-ink-900/15 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-8">
        <p className="font-display text-lg leading-tight whitespace-nowrap">
          Journal <span className="text-ink-500">(Train — <span className="font-grotesk font-semibold tracking-tight text-ink-900 uppercase">Fuel</span> — Thrive)</span>
        </p>
        <p className="eyebrow shrink-0">{formatLongDate()}</p>
      </div>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1.45fr_1fr] lg:gap-8 lg:p-8">
        {/* ── Poster ── */}
        <div className="grain border-[10px] border-poster-frame bg-poster-green p-[5%] text-poster-red [container-type:inline-size]">
          <div className="relative mx-auto w-[86%]">
            <div className="aspect-[4/5] overflow-hidden bg-ink-900 sm:aspect-[5/4]">
              <VintagePhoto photo={PHOTOS.smith89} id="poster" className="contrast-[1.05] saturate-[0.9]" />
            </div>
            <h1 className="relative -mt-[17cqw] text-poster-red">
              <span className="sr-only">Good {timeWord}{name ? `, ${name}` : ''}</span>
              <PosterWord word={timeWord} className="block h-[30cqw] w-full drop-shadow-[0_2px_0_rgb(0_0_0/0.15)]" />
            </h1>
          </div>
          <div className="mx-auto mt-[3cqw] w-[94%] border-[2px] border-current p-[2cqw]">
            <p className="text-justify font-poster text-[max(0.7rem,3.1cqw)] leading-[1.12] uppercase">{blurb}</p>
          </div>
          <SpacedLetters text="Train · Fuel · Thrive" className="mx-auto mt-[2cqw] w-[94%] text-[max(0.75rem,3.6cqw)]" />
        </div>

        {/* ── Plates ── */}
        <div className="flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-1">
            <Figure art="ridge" id="hero-a" index="01" caption="Hanging traverse, Saxon Switzerland, c. 1965" frameClass="aspect-[4/3]" photo={PHOTOS.traverse65} photoClass="grayscale sepia-[0.2] contrast-[1.1]" />
            <Figure art="wall" id="hero-b" index="02" caption="Smith Rock, Oregon — Kodachrome, 1987" frameClass="aspect-[4/3]" className="mt-10 lg:mt-0" photo={PHOTOS.smith87} />
          </div>
          {!c && (
            <a href="#checkin" className="btn-primary self-start">
              Chalk up — check in <ArrowDown size={14} aria-hidden />
            </a>
          )}
        </div>
      </div>

      <Marquee items={['Train. Fuel. Thrive.', 'Chalk up', 'Rest is training too', 'Send it', 'Fuel the climb', 'Listen to your body']} />
    </header>
  );
}
