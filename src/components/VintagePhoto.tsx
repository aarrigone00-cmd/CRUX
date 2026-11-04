import { useState } from 'react';
import type { Photo } from '@/lib/photos';
import { ArtFill, type Art } from './Figure';
import { cx } from './ui';

/** A vintage photograph that falls back to illustrated artwork if it cannot load (offline, blocked network). */
export function VintagePhoto({ photo, fallback = 'ridge', id, className = '' }: { photo: Photo; fallback?: Art; id: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <ArtFill art={fallback} id={id} />;
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      onError={() => setFailed(true)}
      className={cx('h-full w-full object-cover', className)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}
