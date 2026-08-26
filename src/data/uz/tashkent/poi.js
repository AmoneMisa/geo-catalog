const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 100) => ({
  id: `uz:tashkent:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const sourcedPoi = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 120) => ({
  id: `uz:tashkent:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
  sourceUrl,
});

export const TASHKENT_POI_ENTITIES = Object.freeze([
  wikidataPoi('chorsu-bazaar', 'Chorsu Bazaar', 41.3266667, 69.2350000, 'Q13409233', 120),
  wikidataPoi('amir-timur-square', 'Amir Timur Square', 41.3113889, 69.2797194, 'Q4421686', 100),
  wikidataPoi('independence-square', 'Independence Square', 41.3111111, 69.2625000, 'Q3390317', 180),
  wikidataPoi('minor-mosque', 'Minor Mosque', 41.3353056, 69.2750000, 'Q19899486', 75),
  sourcedPoi('alay-bazaar', 'Alay Bazaar', 41.3188097, 69.2811263, 'https://www.dookinternational.com/poi/alay-bazaar/77759', 120),
]);
