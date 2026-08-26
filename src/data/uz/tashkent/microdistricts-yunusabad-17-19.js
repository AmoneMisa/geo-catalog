const osmMicrodistrict = (slug, canonicalName, lat, lng, osmId, accuracyM = 550) => ({
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

export const TASHKENT_YUNUSABAD_17_19_ENTITIES = Object.freeze([
  osmMicrodistrict('yunusabad-17', 'Yunusabad-17', 41.36672, 69.30975, 1866983401),
  osmMicrodistrict('yunusabad-18', 'Yunusabad-18', 41.36952, 69.31701, 1866983402),
  osmMicrodistrict('yunusabad-19', 'Yunusabad-19', 41.37514, 69.31613, 1866983403),
]);
