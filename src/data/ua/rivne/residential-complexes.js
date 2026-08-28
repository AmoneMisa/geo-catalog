const residential = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:rivne:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:rivne',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const UA_RIVNE_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('shchaslyve', 'Shchaslyve', 50.592691, 26.261272, 420, 'https://novobudovy.com/kotedzhni-mistechka-rivne/kotedzhne-mistechko-schastlyve'),
  residential('spectrum', 'Spectrum', 50.632562, 26.284995, 350, 'https://novobudovy.com/novobudovy/zhk-spektrum-m-rivne-vul-kostromska'),
  residential('bridge-tower', 'Bridge Tower', 50.612594, 26.243911, 220, 'https://novobudovy.com/ru/novobudovy-rivne/bridge'),
  residential('teatralnyi', 'Teatralnyi', 50.621991, 26.246651, 220, 'https://novobudovy.com/novobudovy-rivne/zhk-teatralnij-rivne'),
  residential('shokolad', 'Shokolad', 50.642748, 26.200851, 360, 'https://novobudovy.com/rivne/zhk-shokolad-m-rivne-vul-soborna'),
  residential('amber-park', 'Amber Park', 50.606272, 26.278857, 380, 'https://novobudovy.com/novobudovy-rivne/amber-park-rivne'),
  residential('family-city', 'Family City', 50.628035, 26.218316, 420, 'https://novobudovy.com/novobudovy-rivne/family-city'),
]);
