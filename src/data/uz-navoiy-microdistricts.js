const microdistrict = (number, lat, lng, osmId) => ({
  id: `uz:navoiy:microdistrict:${number}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName: `${number} microdistrict`,
  parentId: 'uz:navoiy',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM: 180,
  osm: { type: 'node', id: osmId },
});

export const NAVOIY_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict(1, 40.09952, 65.37104, 10734160840),
  microdistrict(2, 40.09491, 65.37384, 10734160839),
  microdistrict(3, 40.09095, 65.37792, 10734160838),
  microdistrict(4, 40.08645, 65.38081, 10734160837),
  microdistrict(5, 40.09467, 65.38251, 10734160836),
  microdistrict(6, 40.10159, 65.37902, 10734160835),
]);
