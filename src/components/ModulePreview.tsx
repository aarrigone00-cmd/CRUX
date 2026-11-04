import type { ReactNode } from 'react';
import { Figure, type Art } from './Figure';
import { cx } from './ui';
import { Mixed } from './Type';

type Block = 'mustard' | 'sky' | 'cocoa' | 'clay' | 'bone';

const BLOCK: Record<Block, { bg: string; dark: boolean }> = {
  mustard: { bg: 'bg-mustard-300', dark: false },
  sky: { bg: 'bg-sky-300', dark: false },
  cocoa: { bg: 'bg-cocoa-600', dark: true },
  clay: { bg: 'bg-clay-200', dark: false },
  bone: { bg: 'bg-bone-50', dark: false },
};

/**
 * "Archives" spread for modules that ship in Phase 3: flat colour block, mono volume line,
 * Garamond italic title, two small plates and one large plate — then an honest feature list.
 */
export function ModulePreview({
  name,
  vol,
  tagline,
  features,
  principle,
  block = 'mustard',
  plates = ['ridge-calm', 'holds', 'wall'],
  captions = ['Fig. a', 'Fig. b', 'Fig. c'],
}: {
  name: string;
  vol: string;
  tagline: string;
  icon?: ReactNode;
  features: string[];
  principle?: string;
  block?: Block;
  plates?: readonly [Art, Art, Art];
  captions?: readonly [string, string, string];
}) {
  const b = BLOCK[block];
  const ink = b.dark ? 'text-bone-50' : 'text-ink-900';
  const sub = b.dark ? 'text-bone-100/70' : 'text-ink-700';
  return (
    <div className="rise space-y-5">
      <header className={cx('grain p-5 shadow-[var(--shadow-soft)] sm:p-8', b.bg, ink)}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="flex items-baseline gap-5">
            <span className="font-display text-2xl leading-none sm:text-3xl">Archives</span>
            <span className={cx('font-mono text-xs tracking-[0.08em]', sub)}>/VOL. {vol}</span>
          </p>
          <p className="font-mono text-[0.65rem] font-medium tracking-[0.14em] uppercase">In development</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:gap-8">
          <div className="flex flex-col justify-between">
            <div>
              <h1 className={cx('text-6xl leading-none sm:text-7xl', ink)}>
                <Mixed text={name} />
              </h1>
              <p className={cx('mt-3 max-w-xs font-display text-lg italic', sub)}>{tagline}</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <PlateDark key={i} dark={b.dark}>
                  <Figure art={plates[i]} id={`${name}-${i}`} caption={captions[i]} frameClass="aspect-[4/5]" />
                </PlateDark>
              ))}
            </div>
          </div>
          <PlateDark dark={b.dark}>
            <Figure art={plates[2]} id={`${name}-2`} caption={captions[2]} frameClass="aspect-[4/5] sm:aspect-auto sm:h-[26rem]" />
          </PlateDark>
        </div>
      </header>

      <section className="card">
        <p className="eyebrow">Phase 3 · Contents</p>
        <h2 className="mt-2 border-b border-ink-900/15 pb-3 text-3xl leading-tight">
          <Mixed text="What’s coming next" />
        </h2>
        <ol className="mt-1 grid sm:grid-cols-2 sm:gap-x-8">
          {features.map((f, i) => (
            <li key={f} className="flex items-baseline gap-3 border-b border-ink-900/10 py-2.5 text-ink-800">
              <span className="font-mono text-[0.65rem] text-ink-500">{String(i + 1).padStart(2, '0')}</span>
              {f}
            </li>
          ))}
        </ol>
      </section>

      {principle && (
        <section className="card">
          <p className="eyebrow">Our approach</p>
          <p className="mt-2 font-display text-xl leading-snug italic text-ink-800">“{principle}”</p>
        </section>
      )}
    </div>
  );
}

/** Captions on dark blocks need light text. */
function PlateDark({ dark, children }: { dark: boolean; children: ReactNode }) {
  return <div className={dark ? '[&_figcaption]:text-bone-100 [&_figcaption_span]:text-bone-100/60' : ''}>{children}</div>;
}
