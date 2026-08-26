const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 900) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('tashkent-city', 'Tashkent City', 41.31624, 69.24835, 'way', 547234535, 1100),
]);
