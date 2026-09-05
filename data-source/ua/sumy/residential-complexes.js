const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180, extra = {}) => Object.freeze({
  id: `ua:sumy:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:sumy',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
  ...extra,
});

export const UA_SUMY_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('esplanada', 'Esplanada', 50.907753, 34.816032, 'https://novobudovy.com/novobudovy-sum/novobudova-m-sumi-pr-lushpi', 320),
  residential('zarichnyi', 'Zarichnyi', 50.901125, 34.805567, 'https://novobudovy.com/novobudovy-sum/zarichnij-sumi', 260),
  residential('kyivskyi', 'Kyivskyi', 50.934552, 34.782762, 'https://novobudovy.com/ru/novobudovy-sum/kiyivskij-sumi', 260),
  residential('panorama', 'Panorama', 50.896565, 34.826094, 'https://novobudovy.com/novobudovy-sum/panorama-sumi', 320),
]);
