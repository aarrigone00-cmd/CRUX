/** CRUX mark: two overlapping peaks — the crux of a route — with a rising sun. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#48583e" />
      <circle cx="31" cy="17" r="5" fill="#dda7a2" />
      <path d="M6 38 L19 18 L26 28 L31 22 L42 38 Z" fill="#faf6ef" />
      <path d="M19 18 L23 24 L20 23 L17 26 L15.5 23.5 Z" fill="#bcaad3" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-2xl font-semibold tracking-[0.08em] text-charcoal-900">CRUX</span>
    </span>
  );
}
