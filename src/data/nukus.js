const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:nukus:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:nukus',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

export const NUKUS_ENTITIES = Object.freeze([
  osmPoi('savitsky-museum', 'Savitsky Museum', 42.46545, 59.61301, 'way', 884013231, 100, 'Q597055'),
  osmPoi('nukus-airport', 'Nukus Airport', 42.488333, 59.623333, 'relation', 2268677, 260, 'Q976276'),
  osmPoi('karakalpak-state-university', 'Karakalpak State University', 42.45287, 59.62706, 'node', 6974150800, 120, 'Q20536396'),
]);
