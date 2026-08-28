const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:mirzo-ulugbek',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('alay', 'Alay', 41.31732, 69.28738, 'node', 1866932727, 300),
]);
