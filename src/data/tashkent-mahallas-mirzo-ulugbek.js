const mahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 480) => ({
  id: `uz:tashkent:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:mirzo-ulugbek',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_MIRZO_ULUGBEK_MAHALLA_ENTITIES = Object.freeze([
  mahalla('munavvarqori', 'Munavvarqori', 41.35881, 69.37666, 'node', 12165873585, 480),
  mahalla('beshkapa', 'Beshkapa', 41.34703, 69.37658, 'way', 1049529480, 500),
]);
