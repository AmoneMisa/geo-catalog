const mahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 520) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:almazar',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_ALMAZAR_EXTRA_MAHALLA_ENTITIES = Object.freeze([
  mahalla('yangi-tashkent', 'Yangi Tashkent', 41.36743, 69.22415, 'node', 1866058486, 520),
  mahalla('umid', 'Umid', 41.36899, 69.21901, 'way', 1137777682, 520),
]);
