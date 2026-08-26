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

export const TASHKENT_POI_EXTRA_ENTITIES = Object.freeze([
  wikidataPoi('tashkent-north-railway-station', 'Tashkent North Railway Station', 41.2913951, 69.2869144, 'Q12823615', 90),
  wikidataPoi('tashkent-south-railway-station', 'Tashkent South Railway Station', 41.2589731, 69.2263031, 'Q65129482', 90),
  wikidataPoi('tashkent-city-mall', 'Tashkent City Mall', 41.3160620, 69.2524370, 'Q121749626', 90),
  sourcedPoi('magic-city', 'Magic City', 41.3035350, 69.2449160, 'https://aboutthepoint.com/en/point/enh-magic-city', 140),
]);
