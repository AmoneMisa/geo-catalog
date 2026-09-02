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
  neighborhood('vokzalna', 'Vokzalna', 49.8003964, 30.1153656, 1200, { osm: Object.freeze({ type: 'node', id: 8322664948 }) }),
  neighborhood('zarichchia', 'Zarichchia', 49.7968286, 30.0932746, 1200, { osm: Object.freeze({ type: 'node', id: 8322664947 }) }),
  neighborhood('dns', 'DNS', 49.7968356, 30.1294188, 1200, { osm: Object.freeze({ type: 'node', id: 1489524275 }) }),
  neighborhood('3', '3 microdistrict', 49.7887894, 30.1419088, 1000, { osm: Object.freeze({ type: 'node', id: 8322664945 }) }),
  neighborhood('4', '4 microdistrict', 49.7894581, 30.1513421, 1000, { osm: Object.freeze({ type: 'node', id: 8322664946 }) }),
]);
