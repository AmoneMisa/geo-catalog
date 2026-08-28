const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kremenchuk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kremenchuk',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_KREMENCHUK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('tsentr', 'Tsentr', 49.0633252, 33.4035829, 1400, { source: 'manual' }),
  neighborhood('molodizhnyi', 'Molodizhnyi', 49.13838, 33.44022, 1800, { osm: Object.freeze({ type: 'node', id: 3373551564 }), wikidataId: 'Q12124252' }),
  neighborhood('rakivka', 'Rakivka', 49.02446, 33.46398, 1600, { source: 'geonames' }),
  neighborhood('kriukiv', 'Kriukiv', 49.03208, 33.43645, 1700, { osm: Object.freeze({ type: 'node', id: 3373551561 }), wikidataId: 'Q12115162' }),
  neighborhood('velyka-kokhnivka', 'Velyka Kokhnivka', 49.11719, 33.48033, 1800, { source: 'geonames' }),
  neighborhood('nahirna-chastyna', 'Nahirna Chastyna', 49.08519, 33.42576, 1800, { osm: Object.freeze({ type: 'node', id: 3373551565 }), wikidataId: 'Q12132057' }),
  neighborhood('pershyi-zanasyp', 'Pershyi Zanasyp', 49.0640917, 33.4320554, 1400, { osm: Object.freeze({ type: 'node', id: 3373551567 }), wikidataId: 'Q12139999' }),
  neighborhood('druhyi-zanasyp', 'Druhyi Zanasyp', 49.07496, 33.4416, 1400, { osm: Object.freeze({ type: 'node', id: 3373551559 }), wikidataId: 'Q12102514' }),
  neighborhood('tretii-zanasyp', 'Tretii Zanasyp', 49.08205, 33.45744, 1400, { osm: Object.freeze({ type: 'node', id: 3373551573 }), wikidataId: 'Q12162360' }),
]);
