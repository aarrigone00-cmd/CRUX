import { useState } from 'react';
import { Ridge } from './Ridge';

/**
 * The poster photograph: a public-domain vintage climbing photo, served by Wikimedia Commons.
 * Falls back to the ridge artwork if it cannot load (offline, blocked network).
 */
export const VINTAGE_PHOTO = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Group_of_men_and_women_climbing_Paradise_Glacier_in_Mt._Rainier_National_Park%2C_Washington.jpg',
  alt: 'Vintage photograph of a roped party of women and men climbing Paradise Glacier on Mount Rainier, around 1911–1920',
  credit: 'Paradise Glacier, Mt. Rainier, c. 1911–1920. Unknown photographer. Public domain, via Wikimedia Commons.',
  page: 'https://commons.wikimedia.org/wiki/File:Group_of_men_and_women_climbing_Paradise_Glacier_in_Mt._Rainier_National_Park,_Washington.jpg',
};

export function VintagePhoto() {
  const [failed, setFailed] = useState(false);
  if (failed) return <Ridge id="poster" align="xMaxYMax" className="h-full w-full" />;
  return (
    <img
      src={VINTAGE_PHOTO.src}
      alt={VINTAGE_PHOTO.alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover contrast-[1.08] sepia-[0.35]"
      loading="eager"
      decoding="async"
    />
  );
}
