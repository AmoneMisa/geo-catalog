const station = (citySlug, slug, canonicalName, lat, lng, osmId, accuracyM = 120) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const UZ_P3_TRANSPORT_ENTITIES = Object.freeze([
  station('yangiyol', 'yangiyol-railway-station', 'Yangiyol Railway Station', 41.11678, 69.06075, 2209501413),
  station('chust', 'chust-railway-station', 'Chust Railway Station', 40.88312, 71.24116, 1587386149),
]);
