import { Hold, type HoldShape } from './Holds';

/**
 * Decorative bouldering wall: a T-nut bolt grid, scattered "other problem" holds,
 * and one clay-coloured route with start tape and a TOP tag, linked by chalky beta dots.
 */
type Placed = { shape: HoldShape; x: number; y: number; s: number; r: number };

const ROUTE: Placed[] = [
  { shape: 'jug', x: 14, y: 78, s: 13, r: -8 },
  { shape: 'crimp', x: 30, y: 60, s: 12, r: 12 },
  { shape: 'pinch', x: 46, y: 70, s: 10, r: -20 },
  { shape: 'sloper', x: 58, y: 46, s: 13, r: 6 },
  { shape: 'pocket', x: 74, y: 30, s: 11, r: 0 },
  { shape: 'jug', x: 86, y: 10, s: 13, r: 18 },
];

const OTHERS: Array<Placed & { c: string }> = [
  { shape: 'crimp', x: 8, y: 30, s: 10, r: -14, c: '#bea0aa' },
  { shape: 'sloper', x: 24, y: 14, s: 12, r: 10, c: '#f3ebdf' },
  { shape: 'pocket', x: 40, y: 36, s: 8, r: 0, c: '#95a78a' },
  { shape: 'jug', x: 66, y: 76, s: 10, r: 30, c: '#bea0aa' },
  { shape: 'volume', x: 84, y: 60, s: 18, r: -6, c: '#37302b' },
  { shape: 'pinch', x: 54, y: 14, s: 9, r: 40, c: '#f3ebdf' },
  { shape: 'crimp', x: 92, y: 38, s: 9, r: -30, c: '#95a78a' },
];

export function ClimbingWall({ className = '', routeColor = '#cb744c' }: { className?: string; routeColor?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <div className="tnut-grid absolute inset-0 opacity-60" />
      {/* beta line connecting the route */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <polyline
          points={ROUTE.map((h) => `${h.x},${h.y}`).join(' ')}
          fill="none"
          stroke="rgb(243 235 223 / 0.55)"
          strokeWidth="0.6"
          strokeDasharray="1.2 2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {OTHERS.map((h, i) => (
        <Hold key={`o${i}`} shape={h.shape} color={h.c} className="absolute opacity-70" style={pos(h)} />
      ))}
      {ROUTE.map((h, i) => (
        <Hold key={`r${i}`} shape={h.shape} color={routeColor} className="absolute drop-shadow-md" style={pos(h)} />
      ))}
      {/* start tape & top tag */}
      <span className="absolute h-1.5 w-7 -rotate-12 bg-bone-50/90" style={{ left: `${ROUTE[0].x - 3}%`, top: `${ROUTE[0].y + 9}%` }} />
      <span className="absolute bg-bone-50 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-widest text-clay-700" style={{ left: `${ROUTE[5].x - 10}%`, top: `${ROUTE[5].y + 2}%` }}>
        TOP
      </span>
    </div>
  );
}

function pos(h: Placed) {
  return { left: `${h.x - h.s / 2}%`, top: `${h.y - h.s / 2}%`, width: `${h.s}%`, aspectRatio: '1', transform: `rotate(${h.r}deg)` };
}
