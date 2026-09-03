const wikidataPoi = (slug, type, canonicalName, lat, lng, wikidataId, accuracyM) => Object.freeze({
  id: `kz:karaganda:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:karaganda',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `kz:karaganda:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:karaganda',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const KZ_KARAGANDA_POI_ENTITIES = Object.freeze([
  wikidataPoi('karaganda-railway-station', 'poi.railway_station', 'Qarağandı Railway Station', 49.789722, 73.098056, 'Q12574833', 180),
  wikidataPoi('miners-palace-of-culture', 'poi.cultural_venue', "Miners' Palace of Culture", 49.809603, 73.084497, 'Q1665441', 120),
  wikidataPoi('karagandy-central-park', 'poi.park', 'Karagandy Central Park', 49.798889, 73.075889, 'Q65154031', 900),
  wikidataPoi('sary-arka-airport', 'poi.airport', 'Sary-Arka Airport', 49.671667, 73.335278, 'Q117807', 1800),
  wikidataPoi('karaganda-ecological-museum', 'poi.museum', 'Karaganda Ecological Museum', 49.806250, 73.084395, 'Q4213693', 120),
  osmPoi('karaganda-circus', 'poi.cultural_venue', 'Karaganda Circus', 49.800047, 73.084703, 'way', 68354306, 180, 'Q205955'),
  osmPoi('karagandy-arena', 'poi.stadium', 'Karagandy Arena', 49.79, 73.14, 'way', 215516722, 260, 'Q4213697'),
]);
