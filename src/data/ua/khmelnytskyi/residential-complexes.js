const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180, extra = {}) => Object.freeze({
  id: `ua:khmelnytskyi:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:khmelnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
  ...extra,
});

export const UA_KHMELNYTSKYI_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('european', 'European', 49.446414, 26.99705, 'https://novobudovy.com/novobudovy-khmelnytskoho/yevropejskiy', 220),
  residential('avila', 'Avila', 49.454612, 27.016192, 'https://novobudovy.com/arkhiv/zhk-avila-m-hmelnickij-starokostiantinivske-shose', 220),
  residential('perlyna-proskurova', 'Perlyna Proskurova', 49.42636, 26.97686, 'https://mapcarta.com/W1230820193', 260, { osm: Object.freeze({ type: 'way', id: 1230820193 }) }),
]);
