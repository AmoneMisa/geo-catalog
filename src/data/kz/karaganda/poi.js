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

export const KZ_KARAGANDA_POI_ENTITIES = Object.freeze([
  wikidataPoi('karaganda-railway-station', 'poi.railway_station', 'Qarağandı Railway Station', 49.789722, 73.098056, 'Q12574833', 180),
  wikidataPoi('miners-palace-of-culture', 'poi.cultural_venue', "Miners' Palace of Culture", 49.809603, 73.084497, 'Q1665441', 120),
  wikidataPoi('karagandy-central-park', 'poi.park', 'Karagandy Central Park', 49.798889, 73.075889, 'Q65154031', 900),
  wikidataPoi('sary-arka-airport', 'poi.airport', 'Sary-Arka Airport', 49.671667, 73.335278, 'Q117807', 1800),
]);
