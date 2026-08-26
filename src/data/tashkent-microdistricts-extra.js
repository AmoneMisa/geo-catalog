const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 500) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_MICRODISTRICT_EXTRA_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-5', 'Chilanzar-5', 41.29199, 69.21716, 'way', 1101206979),
  osmMicrodistrict('chilanzar-6', 'Chilanzar-6', 41.28683, 69.21111, 'node', 1868258439),
  osmMicrodistrict('chilanzar-7', 'Chilanzar-7', 41.29658, 69.21007, 'node', 1866884785),
  osmMicrodistrict('chilanzar-8', 'Chilanzar-8', 41.29096, 69.20434, 'node', 1866884786),
  osmMicrodistrict('chilanzar-9', 'Chilanzar-9', 41.28828, 69.19897, 'node', 1865344356),
  osmMicrodistrict('chilanzar-10', 'Chilanzar-10', 41.28281, 69.19775, 'node', 1865359942),
]);
