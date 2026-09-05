const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1100) => Object.freeze({
  id: `ua:mukachevo:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mukachevo',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_MUKACHEVO_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('rosvyhovo', 'Rosvyhovo', 48.4519629, 22.7086736, 'node', 5429447531),
  neighborhood('pidhoriany', 'Pidhoriany', 48.4522727, 22.7543149, 'node', 3748961542),
  neighborhood('palanok', 'Palanok', 48.4313464, 22.68655, 'node', 4700347179),
  neighborhood('tsentr', 'Tsentr', 48.44079, 22.7213051, 'node', 11218113781),
]);
