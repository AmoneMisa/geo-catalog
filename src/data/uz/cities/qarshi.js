const wikidataPoi = (slug, canonicalName, type, lat, lng, wikidataId, accuracyM = 140) => ({
  id: `uz:qarshi:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:qarshi',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const osmPoi = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 140) => ({
  id: `uz:qarshi:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:qarshi',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmArea = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 800) => ({
  id: `uz:qarshi:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:qarshi',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const osmMahalla = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 800) => (
  osmArea(slug, canonicalName, 'mahalla', lat, lng, osmType, osmId, accuracyM)
);

export const QARSHI_ENTITIES = Object.freeze([
  wikidataPoi('odina-mosque', 'Odina Mosque', 'poi.mosque', 38.867688, 65.803166, 'Q121536983', 120),
  wikidataPoi('kokgumbaz', 'Kokgumbaz', 'poi.mosque', 38.863806, 65.791611, 'Q12825322', 120),
  wikidataPoi('karshi-airport', 'Karshi Airport', 'poi.airport', 38.802311, 65.773161, 'Q14878327', 260),
  osmPoi('qarshi-railway-station', 'Qarshi Railway Station', 'poi.railway_station', 38.82158, 65.77723, 'way', 367775504, 120),
  osmPoi('nasaf-stadium', 'Nasaf Stadium', 'poi.stadium', 38.83880, 65.81366, 'way', 335384821, 160),
  osmMahalla('nasaf', 'Nasaf', 38.86914, 65.79576, 'way', 1027629334, 750),
  osmMahalla('navo', 'Navo', 38.8331188, 65.7748733, 'way', 1027278316, 700),
  osmMahalla('gungon', 'Gungon', 38.8226311, 65.8104819, 'way', 1027317833, 700),
  osmMahalla('qat', 'Qat', 38.8216925, 65.7982117, 'way', 1027317118, 700),
  osmArea('old-city', 'Old City', 'local_area', 38.8703124, 65.8004859, 'node', 4792825352, 850),
  osmArea('xonobod', 'Xonobod', 'local_area', 38.8663128, 65.832888, 'node', 10588792432, 850),
  wikidataPoi('qarshi-bridge', 'Qarshi Bridge', 'poi.bridge', 38.886694, 65.809611, 'Q86663919', 120),
]);
