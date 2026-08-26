const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:shaykhantahur',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_SHAYKHANTAHUR_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('labzak', 'Labzak', 41.32713, 69.25956, 'node', 1866901281, 650),
]);
