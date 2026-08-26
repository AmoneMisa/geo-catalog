const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 160) => ({
  id: `uz:chirchiq:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:chirchiq',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const CHIRCHIQ_POI_ANCHORS = Object.freeze([
  osmPoi('pedagogical-university', 'Chirchiq Pedagogical University', 41.47297, 69.57738, 'way', 365452080, 170),
  osmPoi('maxam-chirchiq', 'Maxam-Chirchiq', 41.45465, 69.57750, 'way', 46788908, 320),
]);
