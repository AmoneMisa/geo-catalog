const osmEntity = (type, slug, canonicalName, lat, lng, osmType, osmId, accuracy, accuracyM = 140) => ({
  id: `uz:gulistan:${type === 'mahalla' ? 'mahalla' : type === 'microdistrict' ? 'microdistrict' : 'poi'}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:gulistan',
  center: { lat, lng },
  source: 'osm',
  accuracy,
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const GULISTAN_SPATIAL_ENTITIES = Object.freeze([
  osmEntity('mahalla', 'sayqal', 'Sayqal', 40.50522, 68.77828, 'way', 1154906314, 'neighborhood', 220),
  osmEntity('microdistrict', '1', '1 microdistrict', 40.49104, 68.77854, 'node', 4562156364, 'neighborhood', 180),
  osmEntity('microdistrict', '2', '2 microdistrict', 40.50225, 68.77388, 'way', 460500163, 'neighborhood', 220),
  osmEntity('microdistrict', '3', '3 microdistrict', 40.51587, 68.76706, 'way', 362963745, 'neighborhood', 220),
  osmEntity('microdistrict', '4', '4 microdistrict', 40.51132, 68.78337, 'way', 362963744, 'neighborhood', 220),
  osmEntity('poi', 'dehqon-bazaar', 'Dehqon Bazaar', 40.47654, 68.77968, 'way', 464281418, 'poi', 120),
  osmEntity('poi', 'gulistan-state-university', 'Gulistan State University', 40.50611, 68.78324, 'way', 362811771, 'poi', 160),
  osmEntity('poi', 'central-stadium', 'Central Stadium', 40.49938, 68.78234, 'way', 1158899453, 'poi', 180),
]);
