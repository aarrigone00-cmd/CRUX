/**
 * Golden-hour ridgeline: layered desert peaks, a low ochre sun, and a sheer
 * foreground cliff with a dashed climbing route and a climber near the top.
 * Purely decorative.
 */
export function Ridge({ className = '', climber = true, id = 'ridge', align = 'xMidYMid' }: { className?: string; climber?: boolean; id?: string; align?: 'xMidYMid' | 'xMaxYMax' | 'xMidYMax' }) {
  return (
    <svg viewBox="0 0 600 420" preserveAspectRatio={`${align} slice`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#171310" />
          <stop offset="0.38" stopColor="#4a1213" />
          <stop offset="0.66" stopColor="#984524" />
          <stop offset="0.86" stopColor="#d09c3e" />
          <stop offset="1" stopColor="#efd59c" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f6e8c6" />
          <stop offset="0.35" stopColor="#efd59c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e2bb66" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cliff`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a361d" />
          <stop offset="0.45" stopColor="#4a1213" />
          <stop offset="1" stopColor="#171310" />
        </linearGradient>
        <linearGradient id={`${id}-haze`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cb744c" stopOpacity="0" />
          <stop offset="1" stopColor="#cb744c" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <rect width="600" height="420" fill={`url(#${id}-sky)`} />
      <circle cx="250" cy="282" r="150" fill={`url(#${id}-sun)`} />
      <circle cx="250" cy="282" r="38" fill="#f6e8c6" opacity="0.95" />

      {/* far range */}
      <path d="M0 300 L60 250 L105 272 L170 205 L220 252 L270 222 L330 268 L390 214 L440 250 L500 230 L600 270 V420 H0 Z" fill="#81606d" opacity="0.75" />
      <rect y="200" width="600" height="220" fill={`url(#${id}-haze)`} />
      {/* mid range */}
      <path d="M0 330 L50 300 L100 316 L150 276 L205 318 L260 292 L320 330 L370 300 L430 336 L480 312 L600 340 V420 H0 Z" fill="#984524" />
      {/* near range */}
      <path d="M0 370 L70 340 L130 360 L190 332 L250 364 L320 348 L380 376 L600 360 V420 H0 Z" fill="#641919" />

      {/* foreground cliff with strata */}
      <path d="M400 420 L418 300 L430 250 L452 196 L470 150 L488 118 L512 96 L540 88 L575 92 L600 86 V420 Z" fill={`url(#${id}-cliff)`} />
      <g stroke="#cb744c" strokeOpacity="0.28" strokeWidth="1.2" fill="none">
        <path d="M430 252 C480 246 540 256 600 248" />
        <path d="M452 198 C500 192 560 200 600 194" />
        <path d="M418 302 C470 296 540 306 600 298" />
        <path d="M409 362 C470 356 540 366 600 358" />
      </g>
      {/* rim light on the arete */}
      <path d="M418 300 L430 250 L452 196 L470 150 L488 118 L512 96" fill="none" stroke="#efd59c" strokeOpacity="0.55" strokeWidth="2" />

      {climber && (
        <g>
          {/* route: dashed line with quickdraw bolts */}
          <path d="M470 418 C468 380 486 352 478 318 S 492 262 486 226 S 500 170 506 134" fill="none" stroke="#f6e8c6" strokeOpacity="0.75" strokeWidth="1.6" strokeDasharray="2 6" strokeLinecap="round" />
          {[[472, 380], [480, 318], [487, 262], [494, 196]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" fill="#e2bb66" />
          ))}
          {/* climber silhouette, reaching */}
          <g transform="translate(500 150)" fill="#171310" stroke="#171310" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="0" cy="-12" r="4.2" stroke="none" />
            <path d="M-2 -8 L-4 6" strokeWidth="5" fill="none" />
            <path d="M-2 -6 L6 -18 L10 -26" strokeWidth="2.4" fill="none" />
            <path d="M-3 -5 L-12 -2 L-14 6" strokeWidth="2.4" fill="none" />
            <path d="M-4 6 L4 12 L6 22" strokeWidth="2.8" fill="none" />
            <path d="M-4 6 L-12 14 L-10 24" strokeWidth="2.8" fill="none" />
            {/* chalk bag */}
            <circle cx="-6" cy="6" r="2.4" fill="#cb744c" stroke="none" />
          </g>
          <path d="M506 134 C504 140 500 144 496 146" stroke="#f6e8c6" strokeOpacity="0.8" strokeWidth="1.4" fill="none" />
        </g>
      )}
    </svg>
  );
}
