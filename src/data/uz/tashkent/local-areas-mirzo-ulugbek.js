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

const manualLocalArea = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:mirzo-ulugbek',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  sourceUrl,
});

export const TASHKENT_MIRZO_ULUGBEK_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('alay', 'Alay', 41.31732, 69.28738, 'node', 1866932727, 300),
  manualLocalArea('qorasuv', 'Qorasuv', 41.333675, 69.372236, 1600, 'https://yandex.uz/maps/10335/tashkent/geo/qorasuv_dahasi/1724465290/'),
]);
