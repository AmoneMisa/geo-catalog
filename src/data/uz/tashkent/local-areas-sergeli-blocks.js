const osmLocalArea = (slug, canonicalName, lat, lng, osmId, accuracyM = 520) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_SERGELI_BLOCK_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('sergeli-3a', 'Sergeli-3A', 41.21801, 69.20280, 9672641058, 520),
  osmLocalArea('sergeli-5a', 'Sergeli-5A', 41.22330, 69.20291, 6602145049, 520),
  osmLocalArea('sergeli-7a', 'Sergeli-7A', 41.21670, 69.20923, 7485070799, 520),
]);
