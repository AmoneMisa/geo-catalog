const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 550) => ({
  id: `uz:tashkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yunusabad',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YUNUSABAD_4_9_ENTITIES = Object.freeze([
  osmMicrodistrict('yunusabad-4', 'Yunusabad-4', 41.3657, 69.28216, 'node', 2717111033),
  osmMicrodistrict('yunusabad-5', 'Yunusabad-5', 41.36112, 69.27464, 'node', 1867002800),
  osmMicrodistrict('yunusabad-6', 'Yunusabad-6', 41.36884, 69.26419, 'node', 1867002805),
  osmMicrodistrict('yunusabad-7', 'Yunusabad-7', 41.37128, 69.26983, 'way', 917106773),
  osmMicrodistrict('yunusabad-8', 'Yunusabad-8', 41.37129, 69.28102, 'node', 4467322432),
  osmMicrodistrict('yunusabad-9', 'Yunusabad-9', 41.37658, 69.27707, 'node', 1866983404),
]);
