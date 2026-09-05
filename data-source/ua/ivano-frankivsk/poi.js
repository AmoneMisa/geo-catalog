const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 180) => Object.freeze({
  id: `ua:ivano-frankivsk:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:ivano-frankivsk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_IVANO_FRANKIVSK_POI_ENTITIES = Object.freeze([
  poi('ratusha', 'poi.landmark', 'Ratusha', 48.9227606, 24.7103868, 'way', 88299213, 140),
  poi('vichevyi-maidan', 'poi.square', 'Vichevyi Maidan', 48.9202495, 24.7083606, 'node', 11229865506, 160),
  poi('rynok-square', 'poi.square', 'Rynok Square', 48.9226936, 24.710769, 'relation', 5138736, 180),
  // The crawler originally ranked the same-name bus stop first. The attraction
  // below is the physical Bastion owner from the same candidate set.
  poi('bastion', 'poi.fortress', 'Bastion', 48.9226307, 24.7071424, 'way', 292382305, 180),
  poi('potocki-palace', 'poi.palace', 'Potocki Palace', 48.9243842, 24.7135323, 'way', 1167087137, 180),
]);
