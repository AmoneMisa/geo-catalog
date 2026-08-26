const sourcedPark = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 350) => Object.freeze({
  id: `ua:kyiv:poi:${slug}`,
  type: 'poi.park',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
  sourceUrl,
});

const wikidataPark = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 350) => Object.freeze({
  id: `ua:kyiv:poi:${slug}`,
  type: 'poi.park',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const osmPark = (slug, canonicalName, lat, lng, osmType, osmId, wikidataId, accuracyM = 350) => Object.freeze({
  id: `ua:kyiv:poi:${slug}`,
  type: 'poi.park',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const UA_KYIV_POI_ENTITIES = Object.freeze([
  wikidataPark('shevchenko-park', 'Парк Тараса Шевченка', 50.441667, 30.513056, 'Q12138938', 320),
  sourcedPark('mariinskyi-park', 'Маріїнський парк', 50.44694, 30.53972, 'https://commons.wikimedia.org/wiki/Category:Mariinskyi_Park_(Kyiv)', 420),
  osmPark('eternal-glory-park', 'Парк Вічної Слави', 50.43832, 30.55737, 'way', 41079798, 'Q4345217', 420),
  wikidataPark('holosiivskyi-park', 'Голосіївський парк', 50.390278, 30.507222, 'Q3399767', 650),
  osmPark('natalka-park', 'Парк Наталка', 50.49539, 30.52539, 'way', 23858027, 'Q93600485', 420),
  wikidataPark('peremoha-park', 'Парк Перемога', 50.464719, 30.605831, 'Q3400191', 520),
  wikidataPark('kyoto-park', 'Парк Кіото', 50.463639, 30.636331, 'Q12138898', 420),
  osmPark('syretskyi-park', 'Сирецький парк', 50.46744, 30.43878, 'way', 113311396, 'Q28745492', 420),
]);
