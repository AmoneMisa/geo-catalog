const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kremenchuk:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kremenchuk',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KREMENCHUK_POI_ENTITIES = Object.freeze([
  poi('prydniprovskyi-park', 'poi.park', 'Prydniprovskyi Park', 49.0625771, 33.3999821, 900, { wikidataId: 'Q12144115', source: 'manual' }),
  poi('peace-park', 'poi.park', 'Peace Park', 49.0944167, 33.4115833, 700, { wikidataId: 'Q12138916', source: 'wikidata' }),
  poi('kriukivskyi-bridge', 'poi.landmark', 'Kriukivskyi Bridge', 49.0530556, 33.4236111, 600, { osm: Object.freeze({ type: 'way', id: 832668034 }), wikidataId: 'Q4243193', source: 'wikidata' }),
  poi('victory-square', 'poi.square', 'Victory Square', 49.0624362, 33.4049283, 350, { source: 'manual', sourceUrl: 'https://trades.vertas.com.ua/registry/real-estate/view?id=RGL001-UA-20250520-11208' }),
]);
