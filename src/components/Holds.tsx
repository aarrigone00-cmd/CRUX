import type React from 'react';
/**
 * Climbing-hold artwork. Each shape is drawn on a 100×100 canvas with a bolt hole,
 * like the real resin holds screwed to a gym wall.
 */
export type HoldShape = 'jug' | 'crimp' | 'sloper' | 'pinch' | 'pocket' | 'volume';

const PATHS: Record<HoldShape, string> = {
  jug: 'M14 58 C10 34 30 14 54 16 C78 18 92 36 88 58 C85 74 70 70 62 62 C54 56 44 56 36 64 C27 73 16 72 14 58 Z',
  crimp: 'M8 56 C10 44 26 38 50 38 C74 38 92 44 92 56 C92 64 80 66 50 66 C22 66 8 64 8 56 Z',
  sloper: 'M10 70 C10 38 30 14 52 14 C76 14 92 38 90 70 C88 84 12 84 10 70 Z',
  pinch: 'M34 10 C46 6 56 14 58 30 C60 46 70 56 66 74 C62 90 42 94 34 82 C26 70 34 58 30 42 C26 26 24 14 34 10 Z',
  pocket: 'M12 50 C12 26 30 12 52 12 C74 12 90 28 88 52 C86 76 70 90 50 90 C28 90 12 74 12 50 Z',
  volume: 'M6 84 L40 10 L94 52 L72 92 Z',
};

export function Hold({
  shape,
  color,
  className = '',
  rotate = 0,
  style,
}: {
  shape: HoldShape;
  color: string;
  className?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  const bolt = { x: shape === 'volume' ? 52 : 50, y: shape === 'crimp' ? 50 : shape === 'volume' ? 58 : 40 };
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ transform: `rotate(${rotate}deg)`, ...style }} aria-hidden="true">
      {/* underside shadow for depth */}
      <path d={PATHS[shape]} fill="rgb(31 30 29 / 0.22)" transform="translate(3 6)" />
      <path d={PATHS[shape]} fill={color} />
      {/* top highlight */}
      <path d={PATHS[shape]} fill="rgb(255 255 255 / 0.18)" transform="translate(50 50) scale(0.7 0.55) translate(-50 -62)" />
      {shape === 'pocket' && <ellipse cx="50" cy="56" rx="17" ry="11" fill="rgb(31 30 29 / 0.28)" />}
      {shape === 'jug' && <path d="M36 60 C44 52 56 52 64 60" stroke="rgb(31 30 29 / 0.22)" strokeWidth="5" fill="none" strokeLinecap="round" />}
      <circle cx={bolt.x} cy={bolt.y} r="5.5" fill="rgb(31 30 29 / 0.35)" />
      <circle cx={bolt.x} cy={bolt.y} r="2.4" fill="rgb(255 255 255 / 0.4)" />
    </svg>
  );
}

/** Small "tick" marker shaped like a hold — climbers tick routes they've sent. */
export function TickHold({ className = 'h-3 w-3', color = '#e2bb66' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={PATHS.jug} fill={color} />
    </svg>
  );
}
