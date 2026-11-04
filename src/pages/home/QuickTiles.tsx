import { Link } from 'react-router-dom';
import { Doodle, type DoodleKind } from '@/components/Doodle';
import { cx } from '@/components/ui';

/**
 * Index as risograph-style cards: flat colour, one ink per card, mono copy,
 * an oversized hand-lettered word bleeding off the edge, and a hand-drawn mark.
 */
const CARDS: Array<{
  to: string;
  label: string;
  word: string;
  font: 'brush' | 'script' | 'didone';
  bg: string;
  ink: string;
  doodle: DoodleKind;
  doodleClass: string;
  copy: string;
}> = [
  { to: '/train', label: 'Climb', word: 'Send it', font: 'brush', bg: '#ff7a1f', ink: '#1a1410', doodle: 'holds', doodleClass: 'right-[-6%] top-[22%] w-[62%]', copy: 'Boulders, routes, attempts and sends. Grade pyramid, session notes, personal climbing goals.' },
  { to: '/train', label: 'Prep', word: 'warm up', font: 'script', bg: '#95d9b4', ink: '#1f3a8a', doodle: 'climber', doodleClass: 'right-[2%] top-[18%] w-[60%]', copy: 'Fingers, wrists, shoulders, hips. Progressive warm-ups with guided timers. Pain-aware swaps.' },
  { to: '/cycle', label: 'Cycle', word: 'Rhythm', font: 'didone', bg: '#f8aedf', ink: '#e0261b', doodle: 'loops', doodleClass: 'left-[-4%] top-[30%] w-[80%] opacity-70', copy: 'Period calendar, symptoms, mood and energy. Your experience first — never assumptions from dates.' },
  { to: '/fuel', label: 'Fuel', word: 'Fuel', font: 'brush', bg: '#ffd51f', ink: '#24161c', doodle: 'arrow', doodleClass: 'right-[0%] top-[8%] w-[46%]', copy: 'Pre- and post-climb meals, grocery lists, low-prep ideas. Verified nutrition data only.' },
  { to: '/mind', label: 'Mind', word: 'Focus', font: 'didone', bg: '#ddd7b2', ink: '#1c1c1a', doodle: 'cross', doodleClass: 'right-[-8%] top-[14%] w-[70%]', copy: 'Three priorities, simple routines, gentle reminders. Fewer decisions, more done.' },
  { to: '/guide', label: 'Guide', word: 'Beta', font: 'script', bg: '#a3b52f', ink: '#174a1c', doodle: 'zigzag', doodleClass: 'left-[6%] top-[30%] w-[50%] opacity-60', copy: 'Ask for warm-ups, meal ideas, recovery and planning help. AI-generated, clearly labelled.' },
];

const WORD_FONT = {
  brush: 'font-brush text-[34cqw] -rotate-[6deg]',
  script: 'font-script text-[38cqw] -rotate-[8deg]',
  didone: 'font-didone uppercase text-[24cqw] tracking-[-0.03em]',
};

export function QuickTiles() {
  return (
    <nav aria-label="Quick access" className="bg-ink-900 p-1.5 shadow-[var(--shadow-soft)]">
      <p className="flex justify-between px-1.5 pt-1 pb-2.5 font-type text-[0.62rem] tracking-[0.14em] text-bone-100/70 uppercase">
        <span>Index</span>
        <span>06 cards</span>
      </p>
      <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <li key={c.label}>
            <Link
              to={c.to}
              className="grain group relative block aspect-[4/3] overflow-hidden [container-type:inline-size]"
              style={{ backgroundColor: c.bg, color: c.ink }}
              aria-label={`${c.label}: ${c.copy}`}
            >
              <p className="relative z-10 p-[4cqw] font-type text-[max(0.55rem,3.6cqw)] leading-[1.25]">
                <span className="line-clamp-2 sm:line-clamp-3">{c.copy}</span>
              </p>
              <Doodle kind={c.doodle} className={cx('absolute transition-transform duration-500 group-hover:rotate-3', c.doodleClass)} />
              <span
                aria-hidden
                className={cx('absolute bottom-[14%] left-[3%] leading-[0.8] whitespace-nowrap mix-blend-multiply transition-transform duration-500 group-hover:-translate-y-1', WORD_FONT[c.font])}
              >
                {c.word}
              </span>
              <span className="absolute inset-x-[4cqw] bottom-[3cqw] grid grid-cols-3 font-type text-[max(0.55rem,3.4cqw)]">
                <span>0{i + 1}</span>
                <span className="text-center">{c.label}</span>
                <span className="text-right">Open →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
