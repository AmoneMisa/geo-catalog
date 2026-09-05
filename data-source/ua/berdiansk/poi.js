const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 250) => Object.freeze({
  id: `ua:berdiansk:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:berdiansk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_BERDIANSK_POI_ENTITIES = Object.freeze([
  poi('berdiansk-spit', 'poi.landmark', 'Berdiansk Spit', 46.6504378, 36.7825699, 'node', 4791602639, 2200),
  poi('primorska-square', 'poi.square', 'Primorska Square', 46.7497296, 36.7890734, 'way', 449123242, 180),
  poi('sea-port', 'poi', 'Sea Port', 46.7537117, 36.7780633, 'relation', 13967965, 450),
]);
