const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 800) => ({
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

export const TASHKENT_NAMED_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('tashselmash', 'Tashselmash', 41.30804, 69.30694, 'node', 4750099124, 800),
  osmMicrodistrict('aviasozlar', 'Aviasozlar', 41.30222, 69.31107, 'node', 1867099580, 850),
  osmMicrodistrict('kuylyuk', 'Kuylyuk', 41.2486, 69.30096, 'node', 10122671692, 1300),
  osmMicrodistrict('yangi-choshtepa', 'Yangi Choshtepa', 41.23265, 69.19364, 'node', 11548947032, 850),
]);
