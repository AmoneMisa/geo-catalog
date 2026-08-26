const osmLocalArea = (slug, canonicalName, lat, lng, osmId, accuracyM = 650) => ({
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

export const TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('karasu-1', 'Karasu-1', 41.33717, 69.37403, 1868229636),
  osmLocalArea('karasu-2', 'Karasu-2', 41.33194, 69.36380, 1868229637),
  osmLocalArea('karasu-3', 'Karasu-3', 41.33252, 69.36891, 1868229638),
  osmLocalArea('karasu-4', 'Karasu-4', 41.33160, 69.37323, 1868229639),
  osmLocalArea('ttz-1', 'TTZ-1', 41.35890, 69.39140, 1868216233),
  osmLocalArea('ttz-2', 'TTZ-2', 41.35480, 69.38302, 7492673045),
]);
