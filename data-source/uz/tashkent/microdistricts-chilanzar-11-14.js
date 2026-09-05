const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 500) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:uchtepa',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_CHILANZAR_11_14_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-11', 'Chilanzar-11', 41.2777008, 69.1913813, 1865344353),
  osmMicrodistrict('chilanzar-12', 'Chilanzar-12', 41.2821099, 69.1867787, 1865359951),
  osmMicrodistrict('chilanzar-13', 'Chilanzar-13', 41.2907999, 69.1865861, 1865352757),
  osmMicrodistrict('chilanzar-14', 'Chilanzar-14', 41.2945192, 69.1912859, 1865352758),
]);
