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
  residential('spring-town', 'Spring Town', 49.438571, 26.975741, 'https://novobudovy.com/novobudovy-khmelnytskoho/spring-taun', 260),
  residential('grand-royal', 'Grand Royal', 49.450073, 27.014687, 'https://novobudovy.com/novobudovy-khmelnytskoho/zhk-grand-palace-m-hmelnickij-3-cherga', 320),
  residential('paradise', 'Paradise', 49.4312, 26.974944, 'https://maps.visicom.ua/c/26.97495%2C49.4312%2C17/f/ADR3KH6BB7TVWKXM80?lang=uk', 180),
  residential('harmony-garden', 'Harmony Garden', 49.431309, 27.020404, 'https://novobudovy.com/novobudovy-khmelnytskoho/harmony-garden', 300),
]);
