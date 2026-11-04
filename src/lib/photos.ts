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
  licenseUrl?: string;
  page: string;
}

const FRISSELL = 'Toni Frissell / Library of Congress';
const PD = 'Public domain';
const LOC = 'No known restrictions (Library of Congress)';
const BYSA4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };

export const PHOTOS = {
  smith89: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Smith_Rock_Climber_05-1989.jpg/1280px-Smith_Rock_Climber_05-1989.jpg',
    alt: 'A rock climber on a steep volcanic tuff face at Smith Rock, Oregon, photographed on slide film in 1989',
    title: 'Smith Rock Climber, 1989 (Fujichrome slide)',
    author: 'Tequask',
    ...BYSA4,
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
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_11-1987.jpg',
  },
  smith89b: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Smith_Rock_Climber_06-1989.jpg/1280px-Smith_Rock_Climber_06-1989.jpg',
    alt: 'A rock climber on a steep face at Smith Rock, Oregon, on 1989 slide film',
    title: 'Smith Rock Climber, 1989 (Fujichrome slide, II)',
    author: 'Tequask',
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_06-1989.jpg',
  },
  smith87a: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Smith_Rock_Climber_01-1987.jpg',
    alt: 'A rock climber at Smith Rock, Oregon, on 1987 Kodachrome slide film',
    title: 'Smith Rock Climber, 1987 (Kodachrome slide, I)',
    author: 'Tequask',
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_01-1987.jpg',
  },
  smith87c: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Smith_Rock_Climber_03-1987.jpg',
    alt: 'A rock climber at Smith Rock, Oregon, on 1987 Kodachrome slide film',
    title: 'Smith Rock Climber, 1987 (Kodachrome slide, III)',
    author: 'Tequask',
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_03-1987.jpg',
  },
  smith87e: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Smith_Rock_Climber_05-1987.jpg',
    alt: 'A rock climber at Smith Rock, Oregon, on 1987 Kodachrome slide film',
    title: 'Smith Rock Climber, 1987 (Kodachrome slide, V)',
    author: 'Tequask',
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_05-1987.jpg',
  },
  sugarbush59: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Skiing_at_Sugarbush_%28LOC%29_%2855093963018%29.jpg',
    alt: 'Skiers coming down a snowy slope at Sugarbush, Vermont, in 1959, with a ski lift behind',
    title: 'Skiing at Sugarbush, 1959',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Skiing_at_Sugarbush_(LOC)_(55093963018).jpg',
  },
  swiss55: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Sports_Illustrated_-_Switzerland%2C_Job_X3138_%28LOC%29_%2855094024319%29.jpg',
    alt: 'A skier in a red jacket racing down a snowy slope in Switzerland in 1955 as spectators watch',
    title: 'Sports Illustrated — Switzerland, 1955',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Sports_Illustrated_-_Switzerland,_Job_X3138_(LOC)_(55094024319).jpg',
  },
  parkas56: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Sports_Illustrated_-_Ski_Parkas%2C_Job_3599%2C_Part_3_%28LOC%29.jpg',
    alt: 'A model in a pink sweater holding a black fur coat in a snowy forest, 1956',
    title: 'Sports Illustrated — Ski Parkas, 1956',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Sports_Illustrated_-_Ski_Parkas,_Job_3599,_Part_3_(LOC).jpg',
  },
  picnic55: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sports_Illustrated_-_The_Hamptons%2C_Horses%2C_Maidstone_Club%2C_Mending_Nets%2C_Miscellaneous%2C_Picnic_%28LOC%29_-_Flickr_-_The_Library_of_Congress.jpg',
    alt: 'A beach picnic in the Hamptons in 1955: food on a grill table under an umbrella by the ocean',
    title: 'Sports Illustrated — The Hamptons, picnic, 1955',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Sports_Illustrated_-_The_Hamptons,_Horses,_Maidstone_Club,_Mending_Nets,_Miscellaneous,_Picnic_(LOC)_-_Flickr_-_The_Library_of_Congress.jpg',
  },
  montego46: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Toni_Frissell%2C_Fashion_model_on_edge_of_boat%2C_Montego_Bay%2C_Jamaica%2C_1946.jpg',
    alt: 'A fashion model sitting on the edge of a boat at Montego Bay, Jamaica, 1946',
    title: 'Fashion model on edge of boat, Montego Bay, Jamaica, 1946',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Toni_Frissell,_Fashion_model_on_edge_of_boat,_Montego_Bay,_Jamaica,_1946.jpg',
  },
  cusco52: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Toni_Frissell%2C_Llamas%2C_Cusco%2C_Peru%2C_1952.jpg',
    alt: 'Llamas in Cusco, Peru, 1952',
    title: 'Llamas, Cusco, Peru, 1952',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Toni_Frissell,_Llamas,_Cusco,_Peru,_1952.jpg',
  },
  lighthouse51: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/1951_Toni_Frissell_outdoor_fashion_photo_of_model_and_lighthouse_%28enhanced%29.jpg',
    alt: 'Outdoor fashion photograph of a model beside a lighthouse, 1951',
    title: 'Outdoor fashion: model and lighthouse, 1951',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:1951_Toni_Frissell_outdoor_fashion_photo_of_model_and_lighthouse_(enhanced).jpg',
  },
  swim50: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Toni_Frissell%2C_Swim_fashion%2C_1950.jpg',
    alt: 'Three women in swimsuits and flippers, one in a large hat, 1950',
    title: 'Swim fashion, 1950',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Toni_Frissell,_Swim_fashion,_1950.jpg',
  },
  peru52: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Fashion_model_following_women_down_a_street_in_Peru_3g04321v.jpg',
    alt: 'A fashion model following women down a street in Peru, 1952',
    title: 'Fashion model following women down a street in Peru, 1952',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Fashion_model_following_women_down_a_street_in_Peru_3g04321v.jpg',
  },
  weeki47: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Weeki_Wachee_spring_10079u.jpg/1280px-Weeki_Wachee_spring_10079u.jpg',
    alt: 'Underwater view of a woman in a long gown floating in the clear water of Weeki Wachee Springs, Florida, 1947',
    title: 'Weeki Wachee Spring, Florida, 1947',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Weeki_Wachee_spring_10079u.jpg',
  },
  marineland39: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Fashion_model_underwater_in_dolphin_tank%2C_Marineland%2C_Florida_cph3g08173u.jpg/1280px-Fashion_model_underwater_in_dolphin_tank%2C_Marineland%2C_Florida_cph3g08173u.jpg',
    alt: 'A fashion model in a dress underwater in a tank at Marineland, Florida, 1939',
    title: 'Fashion model underwater, Marineland, Florida, 1939',
    author: 'Toni Frissell',
    license: PD,
    page: 'https://commons.wikimedia.org/wiki/File:Fashion_model_underwater_in_dolphin_tank,_Marineland,_Florida_cph3g08173u.jpg',
  },
} satisfies Record<string, Photo>;
