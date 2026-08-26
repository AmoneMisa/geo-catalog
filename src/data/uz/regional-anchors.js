const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

export const UZ_REGIONAL_ANCHORS = Object.freeze([
  osmPoi('denov', 'denov-railway-station', 'Denov Railway Station', 38.27216, 67.90639, 'node', 245671270, 120),
  osmPoi('asaka', 'asaka-railway-station', 'Asaka Railway Station', 40.65515, 72.20600, 'node', 1588631402, 120),
  osmPoi('kogon', 'kogon-railway-station', 'Kogon Railway Station', 39.72483, 64.57633, 'way', 1083455223, 130),
  osmPoi('kattakurgan', 'kattakurgan-railway-station', 'Kattakurgan Railway Station', 39.90249, 66.24589, 'node', 1555221306, 120),
  osmPoi('urgut', 'urgut-railway-station', 'Urgut Railway Station', 39.43951, 67.22976, 'node', 13717491021, 120),
  osmPoi('kogon', 'palace-of-the-emir-of-bukhara', 'Palace of the Emir of Bukhara', 39.72438, 64.54440, 'node', 3348088626, 100, 'Q28086311'),
]);
