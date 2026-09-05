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
  poi('maidan-nezalezhnosti', 'poi.square', 'Майдан Незалежності', 49.419771, 26.978546, 220, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/26.9779%2C49.41981%2C17/f/STR3KH6BB8JW?lang=uk' }),
  poi('franko-park', 'poi.park', 'Парк Франка', 49.41963, 26.99598, 360, { osm: Object.freeze({ type: 'way', id: 1081705794 }), wikidataId: 'Q12138932' }),
  poi('podillia-dendropark', 'poi.park', 'Дендропарк Поділля', 49.439334, 27.021432, 700, { wikidataId: 'Q20076172', source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/27.02036%2C49.4395%2C17/f/POIPZM4KI8?lang=uk' }),
  poi('philharmonic', 'poi.cultural_venue', 'Хмельницька обласна філармонія', 49.41856, 26.97613, 160, { source: 'manual', sourceUrl: 'https://oblfilarmonia.com/contact', osm: Object.freeze({ type: 'node', id: 9888980327 }) }),
  poi('southern-bug-embankment', 'poi.embankment', 'Набережна Південного Бугу', 49.432372, 26.975744, 900, { source: 'manual', sourceUrl: 'https://www.khm.gov.ua/uk/content/zatyshnyy-prostir-bilya-pivdennogo-bugu-chym-pryvablyuye-naberezhna-hmelnyckogo-video' }),
]);
