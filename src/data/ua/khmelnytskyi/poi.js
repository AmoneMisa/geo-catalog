const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:khmelnytskyi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:khmelnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KHMELNYTSKYI_POI_ENTITIES = Object.freeze([
  poi('proskurivska', 'poi.street', 'Проскурівська', 49.419756, 26.996, 1200, { wikidataId: 'Q12092284' }),
  poi('chekman-park', 'poi.park', 'Парк Чекмана', 49.430277, 26.965803, 900, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/26.9658%2C49.43028%2C17/f/POIP45DDL4?lang=uk' }),
  poi('love-island', 'poi.island', 'Острів кохання', 49.43445, 26.97492, 260, { wikidataId: 'Q20083444', osm: Object.freeze({ type: 'way', id: 37560491 }) }),
]);
