const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:ternopil:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:ternopil',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_TERNOPIL_POI_ENTITIES = Object.freeze([
  poi('ternopil-pond', 'poi.lake', 'Ternopil Pond', 49.5642359, 25.577661, 'relation', 3231809, 1200),
  poi('shevchenko-park', 'poi.park', 'Shevchenko Park', 49.5573948, 25.5877723, 'way', 31016415, 500),
  poi('national-revival-park', 'poi.park', 'National Revival Park', 49.5533185, 25.6339767, 'way', 31016220, 650),
  poi('ternopil-castle', 'poi.fortress', 'Ternopil Castle', 49.5533822, 25.5876068, 'way', 103991819, 160),
  poi('teatralnyi-maidan', 'poi.square', 'Teatralnyi Maidan', 49.5535172, 25.5947899, 'way', 31055164, 180),
  poi('lovers-island', 'poi.island', 'Lovers Island', 49.5569177, 25.5852327, 'way', 103998409, 140),
]);
