const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kherson:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kherson',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KHERSON_POI_ENTITIES = Object.freeze([
  poi('kherson-fortress-park', 'poi.park', 'Kherson Fortress Park', 46.64086, 32.62515, 750, { osm: Object.freeze({ type: 'way', id: 146016232 }), wikidataId: 'Q12167198' }),
  poi('slavy-park', 'poi.park', 'Slavy Park', 46.6366611111, 32.6329, 650, { wikidataId: 'Q25394034' }),
  poi('shevchenko-park', 'poi.park', 'Shevchenko Park', 46.635, 32.62, 650, { wikidataId: 'Q12138934' }),
  poi('kherson-sea-port', 'poi.landmark', 'Kherson Sea Port', 46.6259416667, 32.6176, 650, { source: 'manual' }),
  poi('kherson-river-port', 'poi.landmark', 'Kherson River Port', 46.6252777778, 32.6094444444, 500, { wikidataId: 'Q4497362' }),
  poi('st-catherine-cathedral', 'poi.cathedral', 'St Catherine Cathedral', 46.63901, 32.62539, 180, { osm: Object.freeze({ type: 'way', id: 401093980 }), wikidataId: 'Q4411383' }),
  poi('kherson-railway-station', 'poi.landmark', 'Kherson Railway Station', 46.65677, 32.6045, 220, { osm: Object.freeze({ type: 'node', id: 11742271914 }), wikidataId: 'Q9189510' }),
]);
