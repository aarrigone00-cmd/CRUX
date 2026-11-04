/** CRUX mark: a golden-hour peak with a low sun — the crux of the route. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" fill="#171310" />
      <circle cx="31" cy="18" r="5.5" fill="#e2bb66" />
      <path d="M6 38 L19 17 L26 28 L31 22 L42 38 Z" fill="#cb744c" />
      <path d="M19 17 L23.5 24 L20.5 23 L17 26.5 L15.2 23.6 Z" fill="#f3ebdf" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`font-display text-2xl font-semibold tracking-[0.14em] ${light ? 'text-bone-50' : 'text-ink-900'}`}>CRUX</span>
    </span>
  );
}
