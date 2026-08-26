const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 500) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_CHILANZAR_11_14_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-11', 'Chilanzar-11', 41.2777, 69.19138, 1865344353),
  osmMicrodistrict('chilanzar-12', 'Chilanzar-12', 41.28211, 69.18678, 1865359951),
  osmMicrodistrict('chilanzar-13', 'Chilanzar-13', 41.2908, 69.18659, 1865352757),
  osmMicrodistrict('chilanzar-14', 'Chilanzar-14', 41.29452, 69.19129, 1865352758),
]);
