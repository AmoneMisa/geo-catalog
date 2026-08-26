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

const wikidataPoi = (citySlug, slug, canonicalName, lat, lng, wikidataId, accuracyM = 220) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const UZ_SECONDARY_CITY_ANCHORS = Object.freeze([
  osmPoi('navoiy', 'navoiy-railway-station', 'Navoiy Railway Station', 40.07297, 65.39630, 'node', 1238436292, 120),
  osmPoi('jizzakh', 'jizzakh-railway-station', 'Jizzakh Railway Station', 40.09821, 67.84245, 'node', 8327788744, 120),
  osmPoi('termez', 'termez-railway-station', 'Termez Railway Station', 37.25114, 67.28607, 'node', 1584479577, 120),
  osmPoi('gulistan', 'gulistan-railway-station', 'Gulistan Railway Station', 40.49617, 68.76487, 'node', 8343551120, 120),
  osmPoi('chirchiq', 'chirchiq-railway-station', 'Chirchiq Railway Station', 41.47914, 69.59745, 'way', 147143855, 120),
  wikidataPoi('navoiy', 'navoiy-international-airport', 'Navoiy International Airport', 40.11720, 65.17080, 'Q1229483', 300),
  wikidataPoi('termez', 'termez-airport', 'Termez Airport', 37.28670, 67.30990, 'Q658171', 300),
]);
