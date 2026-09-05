const osmMicrodistrict = (slug, canonicalName, parentId, lat, lng, osmId, accuracyM = 500, osmType = 'node') => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_CHILANZAR_15_20_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-15', 'Chilanzar-15', 'uz:tashkent:uchtepa', 41.2958331, 69.1827882, 1865352759),
  osmMicrodistrict('chilanzar-16', 'Chilanzar-16', 'uz:tashkent:chilanzar', 41.27481, 69.1998, 1866861111),
  osmMicrodistrict('chilanzar-17', 'Chilanzar-17', 'uz:tashkent:chilanzar', 41.27187, 69.19687, 1866861115),
  osmMicrodistrict('chilanzar-18', 'Chilanzar-18', 'uz:tashkent:chilanzar', 41.27326, 69.19131, 1865344355),
  osmMicrodistrict('chilanzar-19', 'Chilanzar-19', 'uz:tashkent:chilanzar', 41.2697, 69.18551, 1866856597),
  osmMicrodistrict('chilanzar-20', 'Chilanzar-20', 'uz:tashkent:chilanzar', 41.2665051, 69.1798855, 1850375, 600, 'relation'),
]);
