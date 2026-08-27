const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 360) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yakkasaray',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YAKKASARAY_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('bashlyk', 'Bashlyk', 41.26974, 69.25247, 'node', 1865344348, 360),
  osmLocalArea('kushbegi', 'Kushbegi', 41.26763, 69.24132, 'way', 1117398513, 420),
]);
