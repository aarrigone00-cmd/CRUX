import { Link } from 'react-router-dom';
import { Hold, type HoldShape } from '@/components/Holds';

const TILES: Array<{ to: string; label: string; sub: string; cls: string; hold: HoldShape; holdColor: string }> = [
  { to: '/train', label: 'Climb', sub: 'Log your sends', cls: 'bg-ink-900', hold: 'jug', holdColor: '#f6d76b' },
  { to: '/train', label: 'Prep', sub: 'Warm-ups', cls: 'bg-sky-300', hold: 'sloper', holdColor: '#7e2220' },
  { to: '/cycle', label: 'Cycle', sub: 'Track & learn', cls: 'bg-cocoa-600', hold: 'pocket', holdColor: '#dc9874' },
  { to: '/fuel', label: 'Fuel', sub: 'Eat for the send', cls: 'bg-mustard-300', hold: 'crimp', holdColor: '#121110' },
  { to: '/mind', label: 'Mind', sub: 'Focus & calm', cls: 'bg-oxblood-500', hold: 'pinch', holdColor: '#b9d7ea' },
];

/** Index of sections as colour-block plates with captions. */
export function QuickTiles() {
  return (
    <nav aria-label="Quick access" className="border border-ink-900/10 bg-bone-50 px-5 pt-4 pb-5 shadow-[var(--shadow-soft)] sm:px-8">
      <p className="eyebrow mb-3 flex justify-between border-b border-ink-900/15 pb-2">
        <span>Index</span>
        <span>05 sections</span>
      </p>
      <ul className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
        {TILES.map(({ to, label, sub, cls, hold, holdColor }, i) => (
          <li key={label} className="w-32 shrink-0 sm:w-auto">
            <Link to={to} className="group block">
              <div className={`grain relative aspect-[4/5] overflow-hidden ${cls}`}>
                <Hold shape={hold} color={holdColor} rotate={-14} className="absolute top-1/2 left-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-[0.6rem] text-ink-500">0{i + 1}</span>
                <span className="font-display text-lg leading-none italic group-hover:underline">{label}</span>
              </p>
              <p className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-500 uppercase">{sub}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
