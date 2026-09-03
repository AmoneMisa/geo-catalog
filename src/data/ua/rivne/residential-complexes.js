const residential = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:rivne:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:rivne',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.source ?? 'manual',
  accuracy: 'building',
  accuracyM,
  ...extra,
});

export const UA_RIVNE_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('shchaslyve', 'Shchaslyve', 50.592691, 26.261272, 420, { sourceUrl: 'https://novobudovy.com/kotedzhni-mistechka-rivne/kotedzhne-mistechko-schastlyve' }),
  residential('spectrum', 'Spectrum', 50.632562, 26.284995, 350, { sourceUrl: 'https://novobudovy.com/novobudovy/zhk-spektrum-m-rivne-vul-kostromska' }),
  residential('bridge-tower', 'Bridge Tower', 50.612594, 26.243911, 220, { sourceUrl: 'https://novobudovy.com/ru/novobudovy-rivne/bridge' }),
  residential('teatralnyi', 'Teatralnyi', 50.621991, 26.246651, 220, { sourceUrl: 'https://novobudovy.com/novobudovy-rivne/zhk-teatralnij-rivne' }),
  residential('shokolad', 'Shokolad', 50.642748, 26.200851, 360, { sourceUrl: 'https://novobudovy.com/rivne/zhk-shokolad-m-rivne-vul-soborna' }),
  residential('amber-park', 'Amber Park', 50.606272, 26.278857, 380, { sourceUrl: 'https://novobudovy.com/novobudovy-rivne/amber-park-rivne' }),
  residential('family-city', 'Family City', 50.628035, 26.218316, 420, { sourceUrl: 'https://novobudovy.com/novobudovy-rivne/family-city' }),
  residential('panorama-de-luxe', 'Panorama de Luxe', 50.5990255, 26.2547801, 420, { osm: Object.freeze({ type: 'relation', id: 17629963 }) }),
  residential('pokrovskyi', 'Pokrovskyi', 50.617793, 26.2692262, 300, { osm: Object.freeze({ type: 'way', id: 1227142424 }) }),
]);
