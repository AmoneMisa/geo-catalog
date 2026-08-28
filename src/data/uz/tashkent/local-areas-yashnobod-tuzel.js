const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 520) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yashnobod',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YASHNOBOD_TUZEL_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('tuzel-1', 'Tuzel-1', 41.2989701, 69.3588581, 'way', 88488920, 520),
  osmLocalArea('tuzel-2', 'Tuzel-2', 41.2913859, 69.3611136, 'way', 103133047, 500),
  osmLocalArea('tuzel-3', 'Tuzel-3', 41.2943105, 69.3655664, 'way', 103133050, 520),
  osmLocalArea('tuzel-4', 'Tuzel-4', 41.29599, 69.36759, 'way', 103133046, 520),
]);
