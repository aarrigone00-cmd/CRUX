/** Hand-drawn marks for riso cards: wobbly, round-capped strokes in the card's ink colour. */
export type DoodleKind = 'arrow' | 'loops' | 'climber' | 'cross' | 'holds' | 'zigzag';

export function Doodle({ kind, className = '' }: { kind: DoodleKind; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden="true">
      {kind === 'arrow' && (
        <g {...common} strokeWidth="2.2">
          <path d="M40 10 C 46 40, 30 70, 52 104" />
          <path d="M38 92 L52 106 L62 88" />
          <path d="M120 20 C 150 30, 176 60, 168 98 C 162 128, 120 140, 98 120" strokeWidth="6" />
        </g>
      )}
      {kind === 'loops' && (
        <g {...common} strokeWidth="7">
          <path d="M10 120 C 30 60, 60 40, 80 70 C 96 96, 60 120, 70 80 C 80 40, 130 20, 140 60 C 150 100, 110 110, 130 70 C 150 30, 190 40, 196 80" />
          <path d="M14 30 L 60 46" strokeWidth="3" />
        </g>
      )}
      {kind === 'cross' && (
        <g {...common}>
          <path d="M60 20 L 140 140" strokeWidth="14" />
          <path d="M96 10 L 150 120" strokeWidth="9" />
          <path d="M20 130 L 190 30" strokeWidth="1.6" />
          <path d="M10 70 C 30 60, 50 66, 60 74" strokeWidth="5" />
        </g>
      )}
      {kind === 'zigzag' && (
        <g {...common} strokeWidth="5">
          <path d="M8 110 L 30 60 L 52 108 L 74 54 L 96 104 L 118 50 L 140 100 L 162 46 L 190 96" />
          <circle cx="160" cy="28" r="12" strokeWidth="3" />
        </g>
      )}
      {kind === 'climber' && (
        <g {...common} strokeWidth="2.6">
          {/* wall edge and rope */}
          <path d="M150 0 C 146 50, 156 100, 148 150" strokeWidth="1.6" />
          <path d="M112 0 C 116 30, 104 52, 110 66" strokeDasharray="4 5" strokeWidth="1.6" />
          {/* head with helmet */}
          <path d="M96 40 C 96 26, 124 26, 124 40 Z" />
          <circle cx="110" cy="46" r="9" />
          {/* body */}
          <path d="M108 56 C 104 76, 106 92, 110 104" strokeWidth="5" />
          {/* arms reaching up */}
          <path d="M106 64 C 94 56, 88 42, 92 28" />
          <path d="M112 64 C 128 60, 138 46, 140 32" />
          {/* legs */}
          <path d="M110 104 C 96 112, 94 124, 84 134" />
          <path d="M110 104 C 124 114, 136 118, 142 132" />
          {/* chalk bag & hold */}
          <circle cx="102" cy="100" r="4" />
          <path d="M136 22 C 146 18, 150 28, 142 32 Z" />
        </g>
      )}
      {kind === 'holds' && (
        <g {...common} strokeWidth="2.2">
          <path d="M30 40 C 34 22, 70 20, 72 40 C 66 52, 36 54, 30 40 Z" />
          <circle cx="51" cy="36" r="3" />
          <path d="M120 70 C 124 54, 160 50, 166 70 C 168 84, 122 88, 120 70 Z" />
          <circle cx="143" cy="68" r="3" />
          <path d="M60 110 C 66 96, 96 96, 98 112 C 94 124, 62 124, 60 110 Z" />
          <circle cx="79" cy="109" r="3" />
          <path d="M50 52 C 70 70, 100 60, 118 70" strokeDasharray="3 6" />
        </g>
      )}
    </svg>
  );
}
