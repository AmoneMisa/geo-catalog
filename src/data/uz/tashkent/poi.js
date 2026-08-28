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
  wikidataPoi('tashkent-north-railway-station', 'Tashkent North Railway Station', 41.2913951, 69.2869144, 'Q12823615', 90),
  wikidataPoi('tashkent-south-railway-station', 'Tashkent South Railway Station', 41.2589731, 69.2263031, 'Q65129482', 90),
  wikidataPoi('tashkent-city-mall', 'Tashkent City Mall', 41.3160620, 69.2524370, 'Q121749626', 90),
  sourcedPoi('alay-bazaar', 'Alay Bazaar', 41.3188097, 69.2811263, 'https://www.dookinternational.com/poi/alay-bazaar/77759', 120),
  sourcedPoi('magic-city', 'Magic City', 41.3035350, 69.2449160, 'https://aboutthepoint.com/en/point/enh-magic-city', 140),
  sourcedPoi('tashkent-city-park', 'Tashkent City Park', 41.316540, 69.248410, 'https://mapcarta.com/W749136173', 120),
  sourcedPoi('central-park', 'Central Park', 41.312400, 69.298530, 'https://www.mypacer.com/parks/183181/central-park-tashkent', 180),
  sourcedPoi('farhod-bazaar', 'Farhod Bazaar', 41.285950, 69.190732, 'https://yandex.com/maps/10335/tashkent/house/YkAYdw5gTkYFQFprfX55dHVmZA%3D%3D/', 160),
  sourcedPoi('sergeli-car-bazaar', 'Sergeli Car Bazaar', 41.229909, 69.216971, 'https://yandex.com/maps/org/avtomobilny_rynok/166523932658/', 180),
]);
