const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:bila-tserkva:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:bila-tserkva',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_BILA_TSERKVA_POI_ENTITIES = Object.freeze([
  poi('oleksandriia-arboretum', 'poi.botanical_garden', 'Oleksandriia Arboretum', 49.8122, 30.0672, 1800, { osm: Object.freeze({ type: 'relation', id: 1819246 }), wikidataId: 'Q2424081', source: 'wikidata' }),
  poi('castle-hill', 'poi.landmark', 'Castle Hill', 49.7915, 30.1092, 300, { osm: Object.freeze({ type: 'node', id: 1557519712 }) }),
  poi('torhova-square', 'poi.square', 'Torhova Square', 49.79677, 30.11576, 260, { osm: Object.freeze({ type: 'way', id: 500507335 }), wikidataId: 'Q12162039' }),
  poi('shevchenko-park', 'poi.park', 'Shevchenko Park', 49.79401, 30.11204, 500, { osm: Object.freeze({ type: 'way', id: 96713031 }) }),
  poi('soborna-square', 'poi.square', 'Soborna Square', 49.79275, 30.11216, 260, { osm: Object.freeze({ type: 'way', id: 895350647 }), wikidataId: 'Q16717059' }),
]);
