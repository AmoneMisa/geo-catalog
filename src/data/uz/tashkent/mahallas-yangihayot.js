const mahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 520) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yangihayot',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YANGIHAYOT_MAHALLA_ENTITIES = Object.freeze([
  mahalla('chashtepa', 'Chashtepa', 41.23275, 69.18708, 'node', 12134077645, 520),
  mahalla('yangi-darhan', 'Yangi Darhan', 41.22306, 69.19207, 'way', 171263503, 560),
]);
