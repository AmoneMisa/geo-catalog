const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:berdychiv:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:berdychiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_BERDYCHIV_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('tsentr', 'Tsentr', 49.8960167, 28.5792473, 'node', 10942509721),
  neighborhood('chervona-hora', 'Chervona Hora', 49.8777916, 28.5889645, 'relation', 12801160),
]);
