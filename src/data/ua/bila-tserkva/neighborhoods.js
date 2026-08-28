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
]);
