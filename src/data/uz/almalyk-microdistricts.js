const osmMicrodistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 260) => ({
  id: `uz:almalyk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:almalyk',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const ALMALYK_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('5-1', '5/1 microdistrict', 40.87259, 69.59720, 'node', 13265597237),
  osmMicrodistrict('5-2', '5/2 microdistrict', 40.86932, 69.60923, 'node', 13265620857),
  osmMicrodistrict('5-3', '5/3 microdistrict', 40.86545, 69.60020, 'node', 13265620858),
  osmMicrodistrict('yubileyny', 'Yubileyny microdistrict', 40.86862, 69.60070, 'node', 13265620859),
]);
