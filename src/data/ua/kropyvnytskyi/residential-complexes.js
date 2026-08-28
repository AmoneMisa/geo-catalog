const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180, extra = {}) => Object.freeze({
  id: `ua:kropyvnytskyi:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kropyvnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
  ...extra,
});

export const UA_KROPYVNYTSKYI_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('kovalivskyi', 'Kovalivskyi', 48.51634, 32.254914, 'https://novobudovy.com/novobudovy-kirovohrada/kovalevskij', 260),
  residential('a-plus-ya', 'A+Ya', 48.512177, 32.250523, 'https://novobudovy.com/novobudovy-kirovohrada/aya', 220),
]);
