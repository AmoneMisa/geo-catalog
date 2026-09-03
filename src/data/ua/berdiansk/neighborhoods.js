const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1200) => Object.freeze({
  id: `ua:berdiansk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:berdiansk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_BERDIANSK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('lisky', 'Lisky', 46.7630542, 36.7706108, 'way', 127597574),
  neighborhood('akz', 'AKZ', 46.787259, 36.7320161, 'way', 127600072),
]);
