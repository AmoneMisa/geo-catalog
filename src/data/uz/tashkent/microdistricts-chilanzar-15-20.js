const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 500) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:chilanzar',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_CHILANZAR_15_20_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-15', 'Chilanzar-15', 41.29583, 69.18279, 1865352759),
  osmMicrodistrict('chilanzar-16', 'Chilanzar-16', 41.27481, 69.1998, 1866861111),
  osmMicrodistrict('chilanzar-17', 'Chilanzar-17', 41.27187, 69.19687, 1866861115),
  osmMicrodistrict('chilanzar-18', 'Chilanzar-18', 41.27326, 69.19131, 1865344355),
  osmMicrodistrict('chilanzar-19', 'Chilanzar-19', 41.2697, 69.18551, 1866856597),
  osmMicrodistrict('chilanzar-20', 'Chilanzar-20', 41.26648, 69.18072, 1866856600),
]);
