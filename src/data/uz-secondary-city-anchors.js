const railway = (citySlug, canonicalName, lat, lng, osmType, osmId, accuracyM = 120) => ({
  id: `uz:${citySlug}:poi:${citySlug}-railway-station`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const airport = (citySlug, slug, canonicalName, lat, lng, wikidataId, osmRelationId = null, accuracyM = 260) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: osmRelationId ? 'osm' : 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
  ...(osmRelationId ? { osm: { type: 'relation', id: osmRelationId } } : {}),
});

export const UZ_SECONDARY_CITY_ANCHORS = Object.freeze([
  railway('navoiy', 'Navoiy Railway Station', 40.07297, 65.39630, 'node', 1238436292),
  railway('jizzakh', 'Jizzakh Railway Station', 40.09821, 67.84245, 'node', 8327788744),
  railway('termez', 'Termez Railway Station', 37.25114, 67.28607, 'node', 1584479577),
  railway('gulistan', 'Gulistan Railway Station', 40.49617, 68.76487, 'node', 8343551120),
  railway('chirchiq', 'Chirchiq Railway Station', 41.47914, 69.59745, 'way', 147143855),
  airport('navoiy', 'navoiy-international-airport', 'Navoiy International Airport', 40.117778, 65.175000, 'Q1432150'),
  airport('termez', 'termez-airport', 'Termez Airport', 37.286667, 67.310000, 'Q978073', 7233105),
]);
