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
  osmPoi('molodizhnyi-park', 'Molodizhnyi Park', 'park', 50.00881, 36.25014, 'way', 33743095, 180),
  osmPoi('strilka', 'Strilka', 'square', 49.98681, 36.22595, 'way', 33780052, 160),
  osmPoi('mirror-stream', 'Mirror Stream', 'landmark', 49.99867, 36.23445, 'way', 1347563546, 80),
  osmPoi('annunciation-cathedral', 'Annunciation Cathedral', 'cathedral', 49.99056, 36.22400, 'way', 1341861572, 100),
  osmPoi('historical-museum', 'Historical Museum', 'museum', 49.99261, 36.23057, 'way', 89503751, 90),
  osmPoi('metalist', 'Metalist', 'stadium', 49.98085, 36.26157, 'way', 148932854, 180),
  osmPoi('nikolsky', 'Nikolsky', 'shopping_mall', 49.99159, 36.23518, 'way', 151347688, 120),
  osmPoi('ave-plaza', 'Ave Plaza', 'shopping_mall', 49.99441, 36.23296, 'way', 147521133, 100),
  osmPoi('dafi', 'Dafi', 'shopping_mall', 50.02760, 36.33080, 'way', 89761454, 140),
  osmPoi('kharkiv-pasazhyrskyi', 'Kharkiv-Pasazhyrskyi Station', 'railway_station', 49.98924, 36.20443, 'way', 255940475, 140),
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
