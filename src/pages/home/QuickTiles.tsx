import { Link } from 'react-router-dom';
import { Brain, CalendarHeart, Mountain, Salad, StretchHorizontal } from 'lucide-react';
import { Hold, type HoldShape } from '@/components/Holds';

const TILES: Array<{ to: string; label: string; sub: string; icon: typeof Mountain; cls: string; hold: HoldShape; holdColor: string }> = [
  { to: '/train', label: 'Climb', sub: 'Log your sends', icon: Mountain, cls: 'bg-ink-900 text-bone-50', hold: 'jug', holdColor: '#cb744c' },
  { to: '/train', label: 'Prep', sub: 'Warm-ups', icon: StretchHorizontal, cls: 'bg-clay-600 text-bone-50', hold: 'sloper', holdColor: '#efd59c' },
  { to: '/cycle', label: 'Cycle', sub: 'Track & learn', icon: CalendarHeart, cls: 'bg-oxblood-500 text-bone-50', hold: 'pocket', holdColor: '#bea0aa' },
  { to: '/fuel', label: 'Fuel', sub: 'Eat for the send', icon: Salad, cls: 'bg-ochre-300 text-ink-900', hold: 'crimp', holdColor: '#7a361d' },
  { to: '/mind', label: 'Mind', sub: 'Focus & calm', icon: Brain, cls: 'bg-moss-700 text-bone-50', hold: 'pinch', holdColor: '#dc9874' },
];

export function QuickTiles() {
  return (
    <nav aria-label="Quick access" className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
      <ul className="flex gap-3 lg:grid lg:grid-cols-5">
        {TILES.map(({ to, label, sub, icon: Icon, cls, hold, holdColor }) => (
          <li key={label} className="shrink-0">
            <Link
              to={to}
              className={`grain relative flex h-36 w-32 flex-col justify-between overflow-hidden rounded-[1.25rem] p-4 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1 lg:w-full ${cls}`}
            >
              <Hold shape={hold} color={holdColor} rotate={-18} className="absolute -right-5 -bottom-5 h-20 w-20 opacity-90" />
              <Icon size={20} aria-hidden className="relative" />
              <span className="relative">
                <span className="display-italic block text-2xl leading-none">{label}</span>
                <span className="mt-1 block text-xs font-medium opacity-80">{sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
