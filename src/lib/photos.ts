/**
 * Vintage rock-climbing photographs, served by Wikimedia Commons.
 * Their licences require attribution, which is shown in Profile & privacy → Image credits and the README.
 */
export interface Photo {
  src: string;
  alt: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
}

export const PHOTOS = {
  smith89: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Smith_Rock_Climber_05-1989.jpg/1280px-Smith_Rock_Climber_05-1989.jpg',
    alt: 'A rock climber on a steep volcanic tuff face at Smith Rock, Oregon, photographed on slide film in 1989',
    title: 'Smith Rock Climber, 1989 (Fujichrome slide)',
    author: 'Tequask',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_05-1989.jpg',
  },
  traverse65: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Fotothek_df_ps_0000628_Sport_%5E_Felsen.jpg',
    alt: 'Black-and-white photograph of a climber in a hanging traverse on a sandstone tower in Saxon Switzerland, around 1965',
    title: 'Climber in a hanging traverse, Ostervorturm (Schrammsteine), c. 1965',
    author: 'Richard Peter / Deutsche Fotothek',
    license: 'CC BY-SA 3.0 DE',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',
    page: 'https://commons.wikimedia.org/wiki/File:Fotothek_df_ps_0000628_Sport_%5E_Felsen.jpg',
  },
  smith87: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Smith_Rock_Climber_11-1987.jpg/1280px-Smith_Rock_Climber_11-1987.jpg',
    alt: 'Two rock climbers on either side of a rock face at Smith Rock, Oregon, photographed on Kodachrome slide film in 1987',
    title: 'Smith Rock Climber, 1987 (Kodachrome slide)',
    author: 'Tequask',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_11-1987.jpg',
  },
} satisfies Record<string, Photo>;
