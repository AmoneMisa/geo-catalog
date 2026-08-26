const wikidataPoi = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 140) => ({
  id: `uz:qarshi:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:qarshi',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const QARSHI_ENTITIES = Object.freeze([
  wikidataPoi('odina-mosque', 'Odina Mosque', 38.867688, 65.803166, 'Q121536983', 120),
  wikidataPoi('kokgumbaz', 'Kokgumbaz', 38.863806, 65.791611, 'Q12825322', 120),
  wikidataPoi('karshi-airport', 'Karshi Airport', 38.802311, 65.773161, 'Q14878327', 260),
]);
