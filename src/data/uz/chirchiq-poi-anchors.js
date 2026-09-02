const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 160, type = 'poi') => ({
  id: `uz:chirchiq:poi:${slug}`,
  type,
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
  osmPoi('pedagogical-university', 'Chirchiq Pedagogical University', 41.47297, 69.57738, 'way', 365452080, 170, 'poi.university'),
  osmPoi('maxam-chirchiq', 'Maxam-Chirchiq', 41.45465, 69.57750, 'way', 46788908, 320, 'poi.factory'),
  osmPoi('chirchiq-river', 'Chirchiq River', 41.472377, 69.6052702, 'way', 216918327, 450),
]);
