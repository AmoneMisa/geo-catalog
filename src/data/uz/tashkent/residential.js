const wikidataResidential = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 100) => ({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'building',
  accuracyM,
  wikidataId,
});

const sourcedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 150) => ({
  id: `uz:tashkent:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const TASHKENT_RESIDENTIAL_ENTITIES = Object.freeze([
  wikidataResidential('nest-one', 'Nest One', 41.3121000, 69.2519000, 'Q97658661', 80),
  sourcedResidential('gardens-residence', 'Gardens Residence', 41.3199950, 69.2467130, 'https://www.ehotelsreviews.com/gardens-residence-8635294-ru', 220),
  sourcedResidential('boulevard', 'Boulevard', 41.3158190, 69.2440140, 'https://www.ehotelsreviews.com/boulevard-residence-8865047-en', 220),
  sourcedResidential('mirabad-avenue', 'Mirabad Avenue', 41.2914990, 69.2715170, 'https://yandex.com/maps/10335/tashkent/geo/3287591157/', 180),
  sourcedResidential('darkhan-residence', 'Darkhan Residence', 41.3318190, 69.3106570, 'https://yandex.com/maps/10335/tashkent/geo/5491604117/', 150),
]);
