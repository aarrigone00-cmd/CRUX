import type { CSSProperties } from 'react';
import { Ridge } from './Ridge';
import { ClimbingWall } from './ClimbingWall';
import { Hold } from './Holds';
import { cx } from './ui';
import type { Photo } from '@/lib/photos';
import { VintagePhoto } from './VintagePhoto';

export type Art = 'ridge' | 'ridge-calm' | 'wall' | 'ikat' | 'holds';

/** The artwork that fills an editorial frame. */
export function ArtFill({ art, id }: { art: Art; id: string }) {
  switch (art) {
    case 'ridge':
      return <Ridge id={id} align="xMaxYMax" className="h-full w-full" />;
    case 'ridge-calm':
      return <Ridge id={id} climber={false} align="xMidYMax" className="h-full w-full" />;
    case 'wall':
      return <ClimbingWall className="relative h-full w-full bg-gradient-to-br from-clay-600 to-oxblood-600" />;
    case 'ikat':
      return <div className="h-full w-full bg-[url('/textures/ikat.webp')] bg-[length:420px_auto] bg-center" />;
    case 'holds':
      return (
        <div className="relative h-full w-full bg-sky-300">
          <Hold shape="jug" color="#7e2220" rotate={-12} className="absolute top-[12%] left-[10%] w-[38%]" />
          <Hold shape="sloper" color="#f6d76b" rotate={18} className="absolute right-[8%] bottom-[14%] w-[44%]" />
          <Hold shape="crimp" color="#121110" rotate={-30} className="absolute top-[56%] left-[16%] w-[30%]" />
        </div>
      );
  }
}

/** A framed figure with a small serif caption underneath, like a magazine plate. */
export function Figure({
  art,
  id,
  caption,
  index,
  className = '',
  frameClass = 'aspect-[4/5]',
  style,
  photo,
  photoClass,
}: {
  photo?: Photo;
  photoClass?: string;
  art: Art;
  id: string;
  caption: string;
  index?: string;
  className?: string;
  frameClass?: string;
  style?: CSSProperties;
}) {
  return (
    <figure className={className} style={style}>
      <div className={cx('grain overflow-hidden bg-ink-900', frameClass)}>
        {photo ? <VintagePhoto photo={photo} fallback={art} id={id} className={photoClass} /> : <ArtFill art={art} id={id} />}
      </div>
      <figcaption className="mt-2 flex items-baseline gap-2 font-display text-[0.95rem] leading-tight text-ink-800">
        {index && <span className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500">{index}</span>}
        {caption}
      </figcaption>
    </figure>
  );
}
