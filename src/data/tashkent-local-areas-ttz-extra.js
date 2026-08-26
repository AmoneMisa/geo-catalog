const osmLocalArea = (slug, canonicalName, lat, lng, osmId, accuracyM = 620) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:mirzo-ulugbek',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_TTZ_EXTRA_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('ttz-4', 'TTZ-4', 41.36259, 69.38818, 1868216234, 620),
]);
