/** Slow scrolling ticker, like the footer line of an editorial portfolio. Pauses for reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const line = items.map((t) => `${t}  ·˚◎。·  `).join('');
  return (
    <div className="overflow-hidden border-y border-ink-900/15 bg-bone-50 py-2.5" aria-hidden>
      <div className="marquee flex w-max font-display text-[1.05rem] whitespace-pre text-ink-800 italic">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
