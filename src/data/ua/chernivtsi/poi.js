const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:chernivtsi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernivtsi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_CHERNIVTSI_POI_ENTITIES = Object.freeze([
  poi('metropolitan-residence', 'poi.landmark', 'Резиденція митрополитів', 48.296642, 25.924906, 260, { wikidataId: 'Q156067' }),
  poi('chernivtsi-university', 'poi.university', 'Чернівецький національний університет', 48.296944, 25.924444, 320, { wikidataId: 'Q1551183', osm: Object.freeze({ type: 'way', id: 1019040129 }) }),
  poi('teatralna-square', 'poi.square', 'Театральна площа', 48.291861, 25.932239, 160, { wikidataId: 'Q12160278' }),
  poi('central-square', 'poi.square', 'Центральна площа', 48.292053, 25.935539, 180, { wikidataId: 'Q16722549' }),
  poi('kobylianska-street', 'poi.street', 'Вулиця Ольги Кобилянської', 48.288889, 25.936944, 550, { wikidataId: 'Q12092141', osm: Object.freeze({ type: 'relation', id: 1364210 }) }),
  poi('shevchenko-park', 'poi.park', 'Парк Шевченка', 48.280903, 25.938522, 600, { wikidataId: 'Q108343708' }),
  poi('botanical-garden', 'poi.botanical_garden', 'Ботанічний сад', 48.278932, 25.937452, 280, { wikidataId: 'Q20073890' }),
  poi('city-hall', 'poi.landmark', 'Ратуша', 48.291545, 25.934662, 100, { source: 'manual', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chernivtsi_-_City_hall.jpg', wikidataId: 'Q12170025' }),
]);
