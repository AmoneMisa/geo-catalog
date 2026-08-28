const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 320) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yunusabad',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YUNUSABAD_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('kashgar', 'Kashgar', 41.32022, 69.27649, 'node', 1866932729, 320),
  osmLocalArea('kiyot', 'Kiyot', 41.32538, 69.27791, 'node', 4778058865, 320),
]);
