const GEONAMES_SOURCE = 'https://www.geonames.org/search.html?country=RO&q=Bucharest';

const district = (number, lat, lng, accuracyM) => Object.freeze({
  id: `ro:bucharest:district:sector-${number}`,
  type: 'district',
  country: 'RO',
  canonicalName: `Sector ${number}`,
  parentId: 'ro:bucharest',
  center: Object.freeze({ lat, lng }),
  source: 'geonames',
  sourceUrl: GEONAMES_SOURCE,
  accuracy: 'district',
  accuracyM,
});

export const RO_BUCHAREST_DISTRICT_ENTITIES = Object.freeze([
  district(1, 44.49135551105875, 26.060203075401848, 9000),
  district(2, 44.45815846420474, 26.138298679183407, 7500),
  district(3, 44.417961058834614, 26.169054994437104, 7500),
  district(4, 44.3819075861815, 26.122731009286976, 7500),
  district(5, 44.40216941337376, 26.062355763908645, 7500),
  district(6, 44.43777554029168, 26.01742715215, 7500),
]);
