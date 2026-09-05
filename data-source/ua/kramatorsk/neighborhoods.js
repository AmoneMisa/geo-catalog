const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:kramatorsk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kramatorsk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_KRAMATORSK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('sotsmisto', 'Sotsmisto', 48.7462557, 37.5920728, 'way', 409289791),
  neighborhood('lazurnyi', 'Lazurnyi', 48.7491303, 37.6151892, 'node', 4319214059),
]);
