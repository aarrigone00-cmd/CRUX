import type { ReactNode } from 'react';
import type { Scale } from '@/lib/types';
import type { Tone } from '@/lib/suggestions';

export function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}

export const toneClasses: Record<Tone, string> = {
  sage: 'bg-sage-50 border-sage-200 text-sage-800',
  lavender: 'bg-lavender-50 border-lavender-200 text-lavender-700',
  rose: 'bg-rose-50 border-rose-200 text-rose-700',
  cream: 'bg-cream-200/60 border-cream-300 text-charcoal-700',
};

export function SectionHeader({ title, eyebrow, action, icon }: { title: string; eyebrow?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream-200 text-sage-700">{icon}</span>}
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="font-display text-xl font-semibold">{title}</h2>
        </div>
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
  accent = 'sage',
}: {
  label: string;
  value?: Scale;
  onChange: (v: Scale) => void;
  labels: [string, string, string, string, string];
  accent?: 'sage' | 'lavender' | 'rose';
}) {
  const active = {
    sage: 'bg-sage-700 text-white border-sage-700',
    lavender: 'bg-lavender-600 text-white border-lavender-600',
    rose: 'bg-rose-600 text-white border-rose-600',
  }[accent];
  return (
    <fieldset>
      <legend className="mb-2 flex w-full justify-between text-sm font-semibold text-charcoal-700">
        <span>{label}</span>
        {value && <span className="font-medium text-charcoal-500">{labels[value - 1]}</span>}
      </legend>
      <div className="grid grid-cols-5 gap-2">
        {([1, 2, 3, 4, 5] as Scale[]).map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            aria-label={`${label}: ${n} of 5, ${labels[n - 1]}`}
            onClick={() => onChange(n)}
            className={cx(
              'min-h-12 rounded-xl border text-base font-semibold transition-colors',
              value === n ? active : 'border-cream-300 bg-white text-charcoal-600 hover:bg-cream-200',
            )}
          >
            {n}
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-cream-300)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-sage-600)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 400ms ease' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-charcoal-800">
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
        'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors',
        selected ? 'border-rose-500 bg-rose-100 text-rose-700' : 'border-cream-300 bg-white text-charcoal-600 hover:bg-cream-200',
      )}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'cream' }: { children: ReactNode; tone?: Tone }) {
  return <span className={cx('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', toneClasses[tone])}>{children}</span>;
}
