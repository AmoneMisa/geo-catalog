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

const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140) => ({
  id: `uz:qarshi:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:qarshi',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const QARSHI_ENTITIES = Object.freeze([
  wikidataPoi('odina-mosque', 'Odina Mosque', 38.867688, 65.803166, 'Q121536983', 120),
  wikidataPoi('kokgumbaz', 'Kokgumbaz', 38.863806, 65.791611, 'Q12825322', 120),
  wikidataPoi('karshi-airport', 'Karshi Airport', 38.802311, 65.773161, 'Q14878327', 260),
  osmPoi('qarshi-railway-station', 'Qarshi Railway Station', 38.82158, 65.77723, 'way', 367775504, 120),
  osmPoi('nasaf-stadium', 'Nasaf Stadium', 38.83880, 65.81366, 'way', 335384821, 160),
]);
