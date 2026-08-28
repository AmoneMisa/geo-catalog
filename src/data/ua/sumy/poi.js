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
]);
