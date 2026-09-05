const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:bila-tserkva:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:bila-tserkva',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_BILA_TSERKVA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('levanevskoho', 'Levanevskoho', 49.78663, 30.15185, 1800, { osm: Object.freeze({ type: 'node', id: 1491224239 }) }),
  neighborhood('pishchanyi', 'Pishchanyi', 49.78567, 30.09224, 1600, { osm: Object.freeze({ type: 'node', id: 1491211030 }) }),
  neighborhood('tarashchanskyi', 'Tarashchanskyi', 49.77258, 30.1289, 1800, { osm: Object.freeze({ type: 'node', id: 3104149149 }) }),
  neighborhood('haiok', 'Haiok', 49.80957, 30.04836, 1800, { osm: Object.freeze({ type: 'node', id: 1491212697 }), wikidataId: 'Q16695315' }),
  neighborhood('vokzalna', 'Vokzalna', 49.807645, 30.1065309, 1200, { osm: Object.freeze({ type: 'node', id: 8322664948 }) }),
  neighborhood('zarichchia', 'Zarichchia', 49.7968882, 30.0852688, 1200, { osm: Object.freeze({ type: 'node', id: 8322664947 }) }),
  neighborhood('dns', 'DNS', 49.8105149, 30.0902082, 1200, { osm: Object.freeze({ type: 'node', id: 1489524275 }) }),
  neighborhood('3', '3 microdistrict', 49.78761, 30.1448082, 1000, { osm: Object.freeze({ type: 'node', id: 8322664945 }) }),
  neighborhood('4', '4 microdistrict', 49.7940479, 30.1459113, 1000, { osm: Object.freeze({ type: 'node', id: 8322664946 }) }),
]);
