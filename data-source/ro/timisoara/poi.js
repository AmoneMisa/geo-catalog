const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `ro:timisoara:poi:${slug}`,
  type,
  country: 'RO',
  canonicalName,
  parentId: 'ro:timisoara',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

const wikidataPoi = (slug, type, canonicalName, lat, lng, wikidataId, accuracyM) => Object.freeze({
  id: `ro:timisoara:poi:${slug}`,
  type,
  country: 'RO',
  canonicalName,
  parentId: 'ro:timisoara',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const RO_TIMISOARA_POI_ENTITIES = Object.freeze([
  osmPoi('traian-vuia-international-airport', 'poi.airport', 'Aeroportul Internațional Timișoara „Traian Vuia”', 45.81, 21.338055555555556, 'way', 197252927, 1200, 'Q1417736'),
  wikidataPoi('timisoara-nord-railway-station', 'poi.railway_station', 'Gara Timișoara Nord', 45.75111111111111, 21.2075, 'Q978167', 180),
  wikidataPoi('central-park-anton-scudier', 'poi.park', 'Parcul Central „Anton Scudier”', 45.75138888888889, 21.220278055555556, 'Q12737520', 350),
  wikidataPoi('roses-park', 'poi.park', 'Parcul Rozelor', 45.75, 21.23111111111111, 'Q132449', 300),
  osmPoi('victory-square', 'poi.square', 'Piața Victoriei', 45.75282, 21.22528, 'way', 444125777, 180, 'Q1402782'),
  osmPoi('metropolitan-cathedral', 'poi.cathedral', 'Catedrala Mitropolitană din Timișoara', 45.7507, 21.22423, 'way', 194450516, 120, 'Q1261597'),
  wikidataPoi('union-square', 'poi.square', 'Piața Unirii', 45.75795, 21.22901388888889, 'Q422722', 180),
  wikidataPoi('liberty-square', 'poi.square', 'Piața Libertății', 45.75556666666667, 21.2272, 'Q175320', 180),
]);
