const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 520) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yangihayot',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YANGIDARHAN_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('yangidarhan-1', 'Yangidarhan-1', 41.21851, 69.18963, 'way', 828858196, 520),
  osmLocalArea('yangidarhan-2', 'Yangidarhan-2', 41.22166, 69.19210, 'way', 171263504, 520),
]);
