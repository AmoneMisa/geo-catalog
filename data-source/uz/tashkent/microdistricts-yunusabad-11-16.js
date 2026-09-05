const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 550) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yunusabad',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_YUNUSABAD_11_16_ENTITIES = Object.freeze([
  osmMicrodistrict('yunusabad-11', 'Yunusabad-11', 41.37034, 69.28999, 1867002803),
  osmMicrodistrict('yunusabad-12', 'Yunusabad-12', 41.37974, 69.29449, 1866983398),
  osmMicrodistrict('yunusabad-13', 'Yunusabad-13', 41.36832, 69.29788, 3711597679),
  osmMicrodistrict('yunusabad-14', 'Yunusabad-14', 41.37212, 69.30374, 1867012043),
  osmMicrodistrict('yunusabad-15', 'Yunusabad-15', 41.37801, 69.30068, 1866983400),
  osmMicrodistrict('yunusabad-16', 'Yunusabad-16', 41.38286, 69.30166, 1867012044),
]);
