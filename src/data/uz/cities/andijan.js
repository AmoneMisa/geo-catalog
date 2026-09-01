const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null, type = 'poi') => ({
  id: `uz:andijan:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:andijan',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

const osmMahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 750) => ({
  id: `uz:andijan:mahalla:${slug}`,
  type: 'mahalla',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:andijan',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const officialPoi = (slug, canonicalName, lat, lng, accuracyM = 220, type = 'poi') => ({
  id: `uz:andijan:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:andijan',
  center: { lat, lng },
  source: 'official',
  accuracy: 'poi',
  accuracyM,
});

export const ANDIJAN_ENTITIES = Object.freeze([
  osmPoi('andijan-airport', 'Andijan Airport', 40.72710, 72.29600, 'way', 965652300, 220, 'Q978217', 'poi.airport'),
  osmPoi('andijan-railway-station', 'Andijan Railway Station', 40.76296, 72.35057, 'node', 296078271, 100, null, 'poi.railway_station'),
  osmPoi('andijan-state-university', 'Andijan State University', 40.78948, 72.37338, 'way', 224649709, 140, null, 'poi.university'),
  officialPoi('bobur-park', 'Bobur Park', 40.722000, 72.439111, 280, 'poi.park'),
  officialPoi('bobur-square', 'Bobur Square', 40.761746, 72.351894, 160, 'poi.square'),
  osmPoi('central-farmers-market', 'Central Farmers Market', 40.78644, 72.34473, 'way', 124697493, 180, null, 'poi.market'),
  osmPoi('yangi-bozor', 'Yangi Bozor', 40.75734, 72.35341, 'way', 124437606, 180, null, 'poi.market'),
  osmMahalla('marifat', "Ma'rifat", 40.804963, 72.3808516, 'relation', 20598677, 750),
  osmMahalla('mustaqillikning-21-yilligi', 'Mustaqillikning 21 yilligi', 40.7860529, 72.3121488, 'relation', 20582797, 750),
  osmMahalla('taxtakoprik', "Taxtako'prik", 40.7906501, 72.3692609, 'relation', 20515956, 750),
]);
