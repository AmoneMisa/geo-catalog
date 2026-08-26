const microdistrict = (number, lat, lng, osmId) => ({
  id: `uz:chirchiq:microdistrict:${number}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName: `${number} microdistrict`,
  parentId: 'uz:chirchiq',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM: 500,
  osm: { type: 'node', id: osmId },
});

const sourcedMicrodistrict = (number, lat, lng, sourceUrl, accuracyM = 450) => ({
  id: `uz:chirchiq:microdistrict:${number}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName: `${number} microdistrict`,
  parentId: 'uz:chirchiq',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  sourceUrl,
});

export const CHIRCHIQ_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict(1, 41.48618, 69.57487, 6986095606),
  microdistrict(2, 41.48968, 69.57119, 6986095607),
  microdistrict(3, 41.49382, 69.57752, 6986095608),
  microdistrict(4, 41.49342, 69.58493, 6986095609),
  microdistrict(8, 41.46214, 69.55030, 6986049350),
  sourcedMicrodistrict(9, 41.456855, 69.558556, 'https://yandex.uz/maps/114900/chirchiq/geo/9_kichik_nohiya/3338577675/', 350),
]);
