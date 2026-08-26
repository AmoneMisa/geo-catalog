const osmArea = (slug, canonicalName, parentId, lat, lng, osmType, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_VERIFIED_AREA_ENTITIES = Object.freeze([
  osmArea('takhtapul', 'Takhtapul', 'uz:tashkent:almazar', 41.33968, 69.26428, 'node', 9687947537, 550),
  osmArea('chimbay', 'Chimbay', 'uz:tashkent:almazar', 41.36257, 69.20025, 'node', 1866058485, 650),
  osmArea('yalangach', 'Yalangach', 'uz:tashkent:mirzo-ulugbek', 41.35013, 69.34254, 'node', 1867002807, 800),
]);
