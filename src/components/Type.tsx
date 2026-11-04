import { Fragment, type ReactNode } from 'react';
import { cx } from './ui';

/**
 * CRUX mixed-type system: Bodoni caps, handwritten script, grotesk caps, Garamond italic,
 * and circled "stamps" for little connector words. Chic, but deliberately a bit all over the place.
 */
export type TypeStyle = 'didone' | 'script' | 'grotesk' | 'italic' | 'circle';

export const TYPE: Record<TypeStyle, string> = {
  didone: 'font-didone font-normal uppercase tracking-[-0.01em] not-italic',
  grotesk: 'font-grotesk font-medium uppercase tracking-[-0.035em] not-italic',
  script: 'font-script font-normal normal-case not-italic inline-block -rotate-[4deg] text-[1.5em] leading-[0.5] tracking-normal px-[0.04em] translate-y-[0.06em]',
  italic: 'font-display italic font-normal normal-case',
  circle:
    'inline-grid h-[1.75em] min-w-[1.75em] place-items-center rounded-full border-[0.09em] border-current px-[0.3em] align-[0.12em] font-grotesk text-[0.4em] font-medium uppercase tracking-tight not-italic leading-none',
};

export function T({ s, children, className }: { s: TypeStyle; children: ReactNode; className?: string }) {
  return <span className={cx(TYPE[s], className)}>{children}</span>;
}

const CONNECTORS = new Set(['on', 'of', 'the', 'to', 'for', '&', 'and', 'a', 'in', 'at', 'with', 'your', 'from']);

type Pattern = (i: number, n: number) => TypeStyle;
const PATTERNS: Pattern[] = [
  (i, n) => (i === n - 1 ? 'script' : 'didone'),
  (i) => (i === 0 ? 'script' : 'grotesk'),
  (i, n) => (i === 0 ? 'didone' : i === n - 1 ? 'italic' : 'grotesk'),
  (i, n) => (i === n - 1 ? 'script' : i % 2 ? 'didone' : 'grotesk'),
  (i, n) => (n === 1 ? 'didone' : i === 0 ? 'grotesk' : i === n - 1 ? 'didone' : 'script'),
];

const hash = (str: string) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Render a phrase in mixed type. The mix is chosen from the text, so it is stable across renders. */
export function Mixed({ text, pattern, className }: { text: string; pattern?: number; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const p = PATTERNS[(pattern ?? hash(text)) % PATTERNS.length];
  let circled = false;
  return (
    <span className={className}>
      {words.map((w, i) => {
        const bare = w.toLowerCase().replace(/[^a-z&]/g, '');
        let style = p(i, words.length);
        if (!circled && words.length > 2 && i > 0 && i < words.length - 1 && CONNECTORS.has(bare)) {
          style = 'circle';
          circled = true;
        }
        return (
          <Fragment key={i}>
            {i > 0 && ' '}
            <T s={style}>{w}</T>
          </Fragment>
        );
      })}
    </span>
  );
}
