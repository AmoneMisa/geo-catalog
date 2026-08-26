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

export const CHIRCHIQ_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict(1, 41.48618, 69.57487, 6986095606),
  microdistrict(2, 41.48968, 69.57119, 6986095607),
  microdistrict(3, 41.49382, 69.57752, 6986095608),
  microdistrict(4, 41.49342, 69.58493, 6986095609),
]);
