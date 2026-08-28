const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:poltava:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:poltava',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_POLTAVA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('almaznyi', 'Almaznyi', 49.56676, 34.5055, 1700, { osm: Object.freeze({ type: 'way', id: 1426637769 }) }),
  neighborhood('sady-1', 'Sady-1', 49.5729, 34.49842, 1500, { osm: Object.freeze({ type: 'way', id: 147077000 }) }),
  neighborhood('sady-2', 'Sady-2', 49.57474, 34.5083, 1500, { osm: Object.freeze({ type: 'way', id: 1426892676 }) }),
  neighborhood('ohnivka', 'Ohnivka', 49.57751, 34.51567, 1600, { osm: Object.freeze({ type: 'node', id: 7476444743 }), wikidataId: 'Q12135139' }),
  neighborhood('levada', 'Levada', 49.56928, 34.58041, 1700, { osm: Object.freeze({ type: 'node', id: 7482173851 }), wikidataId: 'Q4256180', geonamesId: '13561774' }),
  neighborhood('podil', 'Podil', 49.58046, 34.57803, 1700, { osm: Object.freeze({ type: 'node', id: 7578702507 }), wikidataId: 'Q12141522', geonamesId: '13561777' }),
  neighborhood('dublianshchyna', 'Dublianshchyna', 49.60358, 34.60685, 1800, { osm: Object.freeze({ type: 'node', id: 6687075985 }), wikidataId: 'Q12102631' }),
  neighborhood('pavlenky', 'Pavlenky', 49.60299, 34.54363, 1500, { osm: Object.freeze({ type: 'node', id: 13116747133 }) }),
  neighborhood('yurivka', 'Yurivka', 49.58954, 34.5167, 1500, { osm: Object.freeze({ type: 'node', id: 7482775250 }), wikidataId: 'Q60860060' }),
]);
