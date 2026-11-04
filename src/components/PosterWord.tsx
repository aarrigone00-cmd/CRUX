/**
 * A single word set in tall condensed poster type, stretched to exactly fill its width
 * (SVG textLength), like a screen-printed travel poster.
 */
export function PosterWord({ word, className = '', height = 260 }: { word: string; className?: string; height?: number }) {
  const w = 1000;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={className} role="img" aria-label={word}>
      <text
        x="0"
        y={height * 0.985}
        textLength={w}
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Anton, Impact, 'Arial Narrow Bold', sans-serif"
        fontSize={height * 1.22}
        fill="currentColor"
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
}

/** Letters spread across the full width: E N E R G Y */
export function SpacedLetters({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p aria-label={text} className={`flex justify-between font-poster uppercase ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </p>
  );
}
