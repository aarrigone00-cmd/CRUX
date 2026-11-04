import type { ComponentType, ReactNode } from 'react';
import type { Scale } from '@/lib/types';
import type { Tone } from '@/lib/suggestions';

export function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(' ');
}

export const toneClasses: Record<Tone, string> = {
  moss: 'bg-moss-50 border-moss-200 text-moss-800',
  mauve: 'bg-mauve-50 border-mauve-200 text-mauve-700',
  clay: 'bg-clay-50 border-clay-200 text-clay-700',
  bone: 'bg-bone-200/60 border-bone-300 text-ink-700',
};

const iconTone: Record<Tone, string> = {
  moss: 'bg-moss-100 text-moss-700',
  mauve: 'bg-ochre-100 text-ochre-600',
  clay: 'bg-clay-100 text-clay-600',
  bone: 'bg-bone-200 text-ink-600',
};

export function SectionHeader({ title, eyebrow, action, icon, tone = 'moss' }: { title: string; eyebrow?: string; action?: ReactNode; icon?: ReactNode; tone?: Tone }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && <span className={cx('grid h-11 w-11 shrink-0 place-items-center hold-blob', iconTone[tone])}>{icon}</span>}
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="font-display text-[1.35rem] font-medium tracking-tight">{title}</h2>
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
  accent = 'moss',
  icons,
}: {
  icons?: Array<ComponentType<{ size?: number; 'aria-hidden'?: boolean }>>;
  label: string;
  value?: Scale;
  onChange: (v: Scale) => void;
  labels: [string, string, string, string, string];
  accent?: 'moss' | 'mauve' | 'clay';
}) {
  const active = {
    moss: 'bg-ink-900 text-bone-50 border-ink-900',
    mauve: 'bg-ochre-300 text-ink-900 border-ochre-400',
    clay: 'bg-clay-600 text-white border-clay-600',
  }[accent];
  return (
    <fieldset>
      <legend className="mb-2 flex w-full justify-between text-sm font-semibold text-ink-700">
        <span>{label}</span>
        {value && <span className="font-medium text-ink-500">{labels[value - 1]}</span>}
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
              'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl border text-sm font-semibold transition-all',
              value === n ? cx(active, 'scale-[1.04] shadow-md') : 'border-bone-300 bg-white/70 text-ink-600 hover:-translate-y-0.5 hover:bg-white',
            )}
          >
            {icons ? (() => { const I = icons[n - 1]; return <I size={22} aria-hidden />; })() : null}
            <span className={icons ? 'text-xs' : 'text-base'}>{n}</span>
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
          stroke="var(--color-clay-500)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 400ms ease' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-ink-800">
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
        selected ? 'border-clay-500 bg-clay-100 text-clay-700' : 'border-bone-300 bg-white text-ink-600 hover:bg-bone-200',
      )}
    >
      {children}
    </button>
  );
}

export function Pill({ children, tone = 'bone' }: { children: ReactNode; tone?: Tone }) {
  return <span className={cx('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', toneClasses[tone])}>{children}</span>;
}
