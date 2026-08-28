const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:sumy:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:sumy',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_SUMY_POI_ENTITIES = Object.freeze([
  poi('altanka', 'poi.landmark', 'Сумська альтанка', 50.906827, 34.799319, 120, { source: 'manual', sourceUrl: 'https://ua.igotoworld.com/projects/tic/sumy/' }),
  poi('pokrovska-square', 'poi.square', 'Покровська площа', 50.9078, 34.7972, 260, { source: 'manual', sourceUrl: 'https://www.turpravda.ua/places/ua/sumy/Pokrovskaja_ploshchad-s7617/' }),
  poi('kozhedub-park', 'poi.park', 'Парк Кожедуба', 50.900137, 34.799742, 800, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/34.79974%2C50.90014%2C17/f/POIK2XMNIL?lang=uk' }),
  poi('chekha-lake', 'poi.lake', 'Озеро Чеха', 50.903601, 34.827494, 700, { source: 'manual', sourceUrl: 'https://www.komandirovka.ru/sights/sumi/ozero-cheha/' }),
  poi('blue-lakes', 'poi.lake', 'Блакитні озера', 50.918458, 34.846488, 900, { source: 'manual', sourceUrl: 'https://navsi100.travel/tours/piznay-ukrainu/golubye-ozera-summy-1173.html' }),
  poi('psel-embankment', 'poi.embankment', 'Набережна Псла', 50.900968, 34.795475, 700, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/34.79514%2C50.9002%2C17/f/STR3KD1GXZGI?lang=uk' }),
  poi('teatralna-square', 'poi.square', 'Театральна площа', 50.906009, 34.798803, 220, { source: 'manual', sourceUrl: 'https://ua.igotoworld.com/projects/tic/sumy/' }),
  poi('transfiguration-cathedral', 'poi.cathedral', 'Спасо-Преображенський собор', 50.909169, 34.800684, 140, { wikidataId: 'Q12154978', sourceUrl: 'https://discover.ua/ru/locations/spaso-preobrazhenskiy-sobor-sumy' }),
  poi('trinity-cathedral', 'poi.cathedral', 'Троїцький собор', 50.917534, 34.816446, 160, { wikidataId: 'Q4463567', sourceUrl: 'https://discover.ua/ru/locations/troyickiy-sobor1' }),
]);
