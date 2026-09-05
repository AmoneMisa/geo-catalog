const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 120, type = 'poi') => ({
  id: `uz:turtkul:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:turtkul',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const approximateArea = (slug, canonicalName, lat, lng, accuracyM = 1200) => ({
  id: `uz:turtkul:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:turtkul',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const TURTKUL_ENTITIES = Object.freeze([
  osmPoi('turtkul-railway-station', 'Turtkul Railway Station', 41.57057, 61.03238, 'node', 1592362133, 100, 'poi.railway_station'),
  osmPoi('bazaar', 'Bazaar', 41.5629189, 61.0107667, 'way', 278779988, 170, 'poi.market'),
  approximateArea('railway-station-area', 'Railway Station area', 41.57057, 61.03238, 1100),
]);
