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
const DOCUMERICA = 'Public domain (U.S. EPA DOCUMERICA, National Archives)';
const FOTOTHEK = { author: 'Richard Peter / Deutsche Fotothek', license: 'CC BY-SA 3.0 DE', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en' };
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
  maiturm42: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Fotothek_df_ps_0001742_Landschaften_%5E_H%C3%BCgellandschaften_-_Gebirgslandschaften_%5E.jpg',
    alt: 'Black-and-white photograph of a climber on the Maiturm sandstone tower, Saxon Switzerland, after 1945',
    title: 'Climber at Maiturm, Saxon Switzerland, after 1945 (I)',
    ...FOTOTHEK,
    page: 'https://commons.wikimedia.org/wiki/File:Fotothek_df_ps_0001742_Landschaften_%5E_H%C3%BCgellandschaften_-_Gebirgslandschaften_%5E.jpg',
  },
  maiturm44: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Fotothek_df_ps_0001744_Landschaften_%5E_H%C3%BCgellandschaften_-_Gebirgslandschaften_%5E.jpg',
    alt: 'Black-and-white photograph of a climber on the Maiturm sandstone tower, Saxon Switzerland, after 1945',
    title: 'Climber at Maiturm, Saxon Switzerland, after 1945 (II)',
    ...FOTOTHEK,
    page: 'https://commons.wikimedia.org/wiki/File:Fotothek_df_ps_0001744_Landschaften_%5E_H%C3%BCgellandschaften_-_Gebirgslandschaften_%5E.jpg',
  },
  smith87d: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Smith_Rock_Climber_04-1987.jpg',
    alt: 'A rock climber at Smith Rock, Oregon, on 1987 Kodachrome slide film',
    title: 'Smith Rock Climber, 1987 (Kodachrome slide, IV)',
    author: 'Tequask',
    ...BYSA4,
    page: 'https://commons.wikimedia.org/wiki/File:Smith_Rock_Climber_04-1987.jpg',
  },
  didi67: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Vogue_-_Didi_Abreu%2C_Details_thru_Didi_%28LOC%29_-_Flickr_-_The_Library_of_Congress.jpg',
    alt: 'Pink wildflowers in the foreground with a snowy peak against a clear blue sky, 1967',
    title: 'Vogue — Didi Abreu, 1967',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Vogue_-_Didi_Abreu,_Details_thru_Didi_(LOC)_-_Flickr_-_The_Library_of_Congress.jpg',
  },
  sherrewogue68: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Autumn_at_Sherrewogue%2C_St._James%2C_L.I._N.Y._%28LOC%29_-_Flickr_-_The_Library_of_Congress.jpg',
    alt: 'A girl sitting on yellow autumn leaves beside a large tree, 1968',
    title: 'Autumn at Sherrewogue, St. James, Long Island, 1968',
    author: FRISSELL,
    license: LOC,
    page: 'https://commons.wikimedia.org/wiki/File:Autumn_at_Sherrewogue,_St._James,_L.I._N.Y._(LOC)_-_Flickr_-_The_Library_of_Congress.jpg',
  },
  skagit73: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/NORTH_FORK_OF_THE_SKAGIT_RIVER_AND_THE_SKAGIT_VALLEY%2C_WITH_THE_CASCADE_MOUNTAINS_IN_THE_BACKGROUND_-_NARA_-_552318.jpg/1280px-NORTH_FORK_OF_THE_SKAGIT_RIVER_AND_THE_SKAGIT_VALLEY%2C_WITH_THE_CASCADE_MOUNTAINS_IN_THE_BACKGROUND_-_NARA_-_552318.jpg',
    alt: 'The North Fork of the Skagit River winding through a green valley with the Cascade Mountains behind, 1973',
    title: 'North Fork of the Skagit River and the Skagit Valley, 1973',
    author: 'Doug Wilson, DOCUMERICA',
    license: DOCUMERICA,
    page: 'https://commons.wikimedia.org/wiki/File:NORTH_FORK_OF_THE_SKAGIT_RIVER_AND_THE_SKAGIT_VALLEY,_WITH_THE_CASCADE_MOUNTAINS_IN_THE_BACKGROUND_-_NARA_-_552318.jpg',
  },
  moose73: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/EARLY_FALL_MORNING_WITH_MIST_BELOW_COLVIN_MOUNTAIN_AT_LITTLE_MOOSE_LAKE%2C_NEAR_INDIAN_LAKE_AND_CEDAR_RIVER_FLOW_-_NARA_-_554752.jpg/1280px-EARLY_FALL_MORNING_WITH_MIST_BELOW_COLVIN_MOUNTAIN_AT_LITTLE_MOOSE_LAKE%2C_NEAR_INDIAN_LAKE_AND_CEDAR_RIVER_FLOW_-_NARA_-_554752.jpg',
    alt: 'Early fall morning with mist below Colvin Mountain at Little Moose Lake in the Adirondacks, 1973',
    title: 'Early fall morning, Little Moose Lake, Adirondacks, 1973',
    author: 'Anne LaBastille, DOCUMERICA',
    license: DOCUMERICA,
    page: 'https://commons.wikimedia.org/wiki/File:EARLY_FALL_MORNING_WITH_MIST_BELOW_COLVIN_MOUNTAIN_AT_LITTLE_MOOSE_LAKE,_NEAR_INDIAN_LAKE_AND_CEDAR_RIVER_FLOW_-_NARA_-_554752.jpg',
  },
  hood73: {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/HOOD_RIVER_VALLEY_AND_THE_NORTHEAST_FACE_OF_MT._HOOD_SHOWING_THE_ELIOT%2C_COE_AND_LADD_GLACIERS_-_NARA_-_548094.jpg/1280px-HOOD_RIVER_VALLEY_AND_THE_NORTHEAST_FACE_OF_MT._HOOD_SHOWING_THE_ELIOT%2C_COE_AND_LADD_GLACIERS_-_NARA_-_548094.jpg',
    alt: 'The green Hood River Valley beneath the snowy northeast face of Mount Hood, 1973',
    title: 'Hood River Valley and the northeast face of Mt. Hood, 1973',
    author: 'David Falconer, DOCUMERICA',
    license: DOCUMERICA,
    page: 'https://commons.wikimedia.org/wiki/File:HOOD_RIVER_VALLEY_AND_THE_NORTHEAST_FACE_OF_MT._HOOD_SHOWING_THE_ELIOT,_COE_AND_LADD_GLACIERS_-_NARA_-_548094.jpg',
  },
} satisfies Record<string, Photo>;
