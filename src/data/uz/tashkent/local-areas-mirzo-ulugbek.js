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
  osmLocalArea('karasu-1', 'Karasu-1', 41.33717, 69.37403, 'node', 1868229636, 650),
  osmLocalArea('karasu-2', 'Karasu-2', 41.33194, 69.36380, 'node', 1868229637, 650),
  osmLocalArea('karasu-3', 'Karasu-3', 41.33252, 69.36891, 'node', 1868229638, 650),
  osmLocalArea('karasu-4', 'Karasu-4', 41.33160, 69.37323, 'node', 1868229639, 650),
  osmLocalArea('ttz-1', 'TTZ-1', 41.35890, 69.39140, 'node', 1868216233, 650),
  osmLocalArea('ttz-2', 'TTZ-2', 41.35480, 69.38302, 'node', 7492673045, 650),
  osmLocalArea('ttz-4', 'TTZ-4', 41.36259, 69.38818, 'node', 1868216234, 620),
  osmLocalArea('alay', 'Alay', 41.31732, 69.28738, 'node', 1866932727, 300),
]);
