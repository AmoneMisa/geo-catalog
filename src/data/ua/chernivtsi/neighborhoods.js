const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:chernivtsi:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernivtsi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_CHERNIVTSI_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('kalichanka', 'Калічанка', 48.298889, 25.970561, 900, { wikidataId: 'Q16700730' }),
  neighborhood('sadhora', 'Садгора', 48.35, 25.966667, 1700, { wikidataId: 'Q2005381' }),
  neighborhood('rosha', 'Роша', 48.29315, 25.89105, 1100, { wikidataId: 'Q16714801', osm: Object.freeze({ type: 'node', id: 2377048990 }) }),
  neighborhood('klokuchka', 'Клокучка', 48.30546, 25.91431, 1100, { source: 'manual', sourceUrl: 'https://mapcarta.com/13756902' }),
  neighborhood('lenkivtsi', 'Ленківці', 48.325841, 25.900117, 1300, { source: 'manual', sourceUrl: 'https://www.geonames.org/advanced-search.html?q=Ukraine%2C+Chernivtsi' }),
  neighborhood('hraviton', 'Гравітон', 48.27592, 25.99461, 1100, { wikidataId: 'Q131706659', osm: Object.freeze({ type: 'node', id: 10650273334 }) }),
]);
