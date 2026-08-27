const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 600) => ({
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

export const TASHKENT_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('chilanzar-1', 'Chilanzar-1', 41.28424, 69.22845, 'node', 1868258435, 450),
  osmMicrodistrict('chilanzar-2', 'Chilanzar-2', 41.27934, 69.22306, 'node', 1868258436, 450),
  osmMicrodistrict('chilanzar-3', 'Chilanzar-3', 41.28449, 69.22325, 'way', 103635640, 500),
  osmMicrodistrict('chilanzar-5', 'Chilanzar-5', 41.29199, 69.21716, 'way', 1101206979, 500),
  osmMicrodistrict('chilanzar-6', 'Chilanzar-6', 41.28683, 69.21111, 'node', 1868258439, 500),
  osmMicrodistrict('chilanzar-7', 'Chilanzar-7', 41.29658, 69.21007, 'node', 1866884785, 500),
  osmMicrodistrict('chilanzar-8', 'Chilanzar-8', 41.29096, 69.20434, 'node', 1866884786, 500),
  osmMicrodistrict('chilanzar-9', 'Chilanzar-9', 41.28828, 69.19897, 'node', 1865344356, 500),
  osmMicrodistrict('chilanzar-10', 'Chilanzar-10', 41.28281, 69.19775, 'node', 1865359942, 500),
  osmMicrodistrict('karakamysh', 'Karakamysh', 41.364, 69.21475, 'node', 10119542204, 1100),
  osmMicrodistrict('sebzar', 'Sebzar', 41.33478, 69.24943, 'node', 1866097655, 650),
]);
