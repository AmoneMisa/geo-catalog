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
  osmLocalArea('hadra', 'Khadra', 41.32409, 69.24911, 'node', 1868488533, 280),
  osmLocalArea('jangoh', 'Jangoh', 41.32882, 69.25248, 'node', 1866901280, 280),
  osmLocalArea('karatash', 'Karatash', 41.31722, 69.23683, 'node', 4706446883, 320),
]);
