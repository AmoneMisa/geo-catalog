const poi = (slug, canonicalName, poiType, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kharkiv:poi:${slug}`,
  type: `poi.${poiType}`,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.source ?? 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

const osmPoi = (slug, canonicalName, poiType, lat, lng, osmType, osmId, accuracyM = 120) => poi(
  slug,
  canonicalName,
  poiType,
  lat,
  lng,
  accuracyM,
  {
    osm: Object.freeze({ type: osmType, id: osmId }),
    sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  },
);

export const UA_KHARKIV_POI_ENTITIES = Object.freeze([
  osmPoi('shevchenko-garden', 'Shevchenko Garden', 'park', 50.00126, 36.23061, 'way', 346335614, 180),
  osmPoi('central-park', 'Central Park', 'park', 50.02043, 36.24625, 'way', 33770412, 260),
  osmPoi('sarzhyn-yar', 'Sarzhyn Yar', 'park', 50.02891, 36.23599, 'way', 33770366, 300),
  osmPoi('molodizhnyi-park', 'Molodizhnyi Park', 'park', 50.00881, 36.25014, 'way', 33743095, 180),
  poi('machine-builders-park', 'Machine Builders Park', 'park', 49.96913799558902, 36.29369997301611, 350, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/c/36.29369%2C49.96914%2C17/f/POIIX4EN8M?lang=uk',
  }),
  poi('zelenyi-hai', 'Zelenyi Hai', 'park', 49.9411737692331, 36.39280211516017, 350, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/c/36.39280211516017%2C49.9411737692331%2C17/f/POI1MQ9UPTJ?lang=uk',
  }),
  poi('karpivskyi-garden', 'Karpivskyi Garden', 'park', 49.977734839868766, 36.204844015002706, 250, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/i/POI2KWIF5EJ',
  }),
  osmPoi('pokrovskyi-square', 'Pokrovskyi Square', 'park', 49.99117, 36.22881, 'way', 1361688576, 140),
  osmPoi('strilka', 'Strilka', 'square', 49.98681, 36.22595, 'way', 33780052, 160),
  osmPoi('mirror-stream', 'Mirror Stream', 'landmark', 49.99867, 36.23445, 'way', 1347563546, 80),
  osmPoi('annunciation-cathedral', 'Annunciation Cathedral', 'cathedral', 49.99056, 36.22400, 'way', 1341861572, 100),
  osmPoi('pokrovskyi-monastery', 'Pokrovskyi Monastery', 'religious_complex', 49.99206, 36.22911, 'way', 34896283, 150),
  osmPoi('historical-museum', 'Historical Museum', 'museum', 49.99261, 36.23057, 'way', 89503751, 90),
  osmPoi('khai', 'KhAI', 'university', 50.04361, 36.28584, 'way', 319064736, 220),
  osmPoi('khpi', 'KhPI', 'university', 49.99921, 36.25025, 'way', 77004689, 220),
  osmPoi('khnure', 'KhNURE', 'university', 50.01534, 36.22892, 'way', 105835020, 180),
  osmPoi('metalist', 'Metalist', 'stadium', 49.98085, 36.26157, 'way', 148932854, 180),
  osmPoi('nikolsky', 'Nikolsky', 'shopping_mall', 49.99159, 36.23518, 'way', 151347688, 120),
  osmPoi('ave-plaza', 'Ave Plaza', 'shopping_mall', 49.99441, 36.23296, 'way', 147521133, 100),
  osmPoi('dafi', 'Dafi', 'shopping_mall', 50.02760, 36.33080, 'way', 89761454, 140),
  poi('french-boulevard', 'French Boulevard', 'shopping_mall', 49.990229, 36.289943, 180, {
    source: 'manual',
    sourceUrl: 'https://novobudovy.com/ru/novobudovy/torgovo-rozvazhalnij-centr-francuzkij-bulvar-m-harkiv',
  }),
  osmPoi('barabashovo-market', 'Barabashovo Market', 'market', 50.00428, 36.30141, 'way', 89433884, 350),
  osmPoi('kharkiv-pasazhyrskyi', 'Kharkiv-Pasazhyrskyi Station', 'railway_station', 49.98924, 36.20443, 'way', 255940475, 140),
  poi('kharkiv-zoo', 'Kharkiv Zoo', 'zoo', 50.002778, 36.225, 250, {
    source: 'wikidata',
    wikidataId: 'Q4496313',
    osm: Object.freeze({ type: 'way', id: 33651304 }),
    sourceUrl: 'https://www.wikidata.org/wiki/Q4496313',
  }),
  poi('freedom-square', 'Freedom Square', 'square', 50.00446, 36.23404, 120, {
    source: 'manual',
    sourceUrl: 'https://mapcarta.com/25788528',
  }),
  poi('karazin-university', 'Karazin University', 'university', 50.00617, 36.22508, 120, {
    source: 'manual',
    sourceUrl: 'https://mapcarta.com/35570790',
  }),
  poi('karavan', 'Karavan', 'shopping_mall', 50.029047, 36.328194, 180, {
    source: 'manual',
    sourceUrl: 'https://kharkov.wiki/buildings/73397/',
  }),
]);
