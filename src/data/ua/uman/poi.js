const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:uman:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:uman',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_UMAN_POI_ENTITIES = Object.freeze([
  poi('sofiyivka-park', 'poi.park', 'Sofiyivka Park', 48.7638868, 30.2318346, 'relation', 977418, 900),
  poi('rabbi-nachman-tomb', 'poi.landmark', 'Rabbi Nachman Tomb', 48.747053, 30.2341588, 'node', 2362821060, 120),
  poi('central-square', 'poi.square', 'Central Square', 48.7500363, 30.2200133, 'way', 997149578, 180),
]);
