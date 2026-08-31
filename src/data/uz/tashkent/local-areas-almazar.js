const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 600) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:almazar',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_ALMAZAR_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('karakamysh-1-2', 'Karakamysh-1/2', 41.35729, 69.23594, 'node', 1866791241),
  osmLocalArea('karakamysh-2-3', 'Karakamysh-2/3', 41.3674364, 69.2156743, 'way', 134756857),
  osmLocalArea('karakamysh-2-4', 'Karakamysh-2/4', 41.36786, 69.20858, 'node', 1866058432),
  osmLocalArea('karakamysh-2-5', 'Karakamysh-2/5', 41.36092, 69.20909, 'node', 1866058434),
  // Current map data exposes Taxtapul as a standalone Almazar dahasi; the point is a representative area center, not a building anchor.
  {
    id: 'uz:tashkent:local-area:taxtapul',
    type: 'local_area',
    country: 'UZ',
    canonicalName: 'Taxtapul',
    parentId: 'uz:tashkent:almazar',
    center: { lat: 41.343113, lng: 69.259525 },
    source: 'manual',
    accuracy: 'approximate',
    accuracyM: 700,
  },
]);
