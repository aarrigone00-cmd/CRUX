import type { ComponentType, ReactNode } from 'react';
import type { Scale } from '@/lib/types';
import type { Tone } from '@/lib/suggestions';
import { Mixed } from './Type';

export function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}

export const toneClasses: Record<Tone, string> = {
  moss: 'bg-sky-100 border-sky-200 text-ink-800',
  mauve: 'bg-mustard-200/60 border-mustard-300 text-ink-800',
  clay: 'bg-clay-50 border-clay-200 text-clay-800',
  bone: 'bg-bone-100 border-bone-300 text-ink-700',
};

/** Editorial section header: mono kicker, Garamond italic title, hairline rule. Icons are intentionally not shown. */
export function SectionHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: ReactNode; icon?: ReactNode; tone?: Tone }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3 border-b border-ink-900/15 pb-3">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-[1.7rem] leading-[1.05]">
          <Mixed text={title} />
        </h2>
      </div>
      {action}
    </div>
  );
}

/** Big, labelled 1–5 buttons. Easier and faster than sliders, especially on phones. */
export function ScalePicker({
  label,
  value,
  onChange,
  labels,
  accent = 'moss',
  icons,
}: {
  icons?: Array<ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>>;
  label: string;
  value?: Scale;
  onChange: (v: Scale) => void;
  labels: [string, string, string, string, string];
  accent?: 'moss' | 'mauve' | 'clay';
}) {
  const active = {
    moss: 'bg-ink-900 text-bone-50 border-ink-900',
    mauve: 'bg-mustard-300 text-ink-900 border-ink-900',
    clay: 'bg-clay-600 text-white border-clay-600',
  }[accent];
  return (
    <fieldset>
      <legend className="mb-2 flex w-full justify-between font-mono text-[0.7rem] tracking-[0.12em] text-ink-700 uppercase">
        <span>{label}</span>
        {value && <span className="font-display text-base tracking-normal text-ink-600 normal-case italic">{labels[value - 1]}</span>}
      </legend>
      <div className="grid grid-cols-5 gap-1.5">
        {([1, 2, 3, 4, 5] as Scale[]).map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            aria-label={`${label}: ${n} of 5, ${labels[n - 1]}`}
            onClick={() => onChange(n)}
            className={cx(
              'flex min-h-14 flex-col items-center justify-center gap-1 border transition-colors',
              value === n ? active : 'border-ink-900/15 bg-transparent text-ink-600 hover:border-ink-900',
            )}
          >
            {icons ? (() => { const I = icons[n - 1]; return <I size={20} aria-hidden strokeWidth={1.5} />; })() : null}
            <span className="font-mono text-[0.68rem]">0{n}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ProgressRing({ value, max, size = 56, label }: { value: number; max: number; size?: number; label: string }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-bone-300)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-ink-900)"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 400ms ease' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-xs text-ink-800">
        {value}/{max}
      </span>
    </div>
  );
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        'min-h-10 border px-3.5 font-mono text-[0.7rem] tracking-[0.1em] uppercase transition-colors',
        selected ? 'border-ink-900 bg-ink-900 text-mustard-300' : 'border-ink-900/20 text-ink-700 hover:border-ink-900',
      )}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'bone' }: { children: ReactNode; tone?: Tone }) {
  return <span className={cx('inline-flex items-center border px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.1em] uppercase', toneClasses[tone])}>{children}</span>;
}
