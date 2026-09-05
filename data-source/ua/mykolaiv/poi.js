const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:mykolaiv:poi:${slug}`,
  type: extra.type ?? 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mykolaiv',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_MYKOLAIV_POI_ENTITIES = Object.freeze([
  poi('soborna-square', 'Soborna Square', 46.97563, 31.99387, 220, { osm: Object.freeze({ type: 'way', id: 704870336 }), type: 'poi.square' }),
  poi('mykolaiv-zoo', 'Mykolaiv Zoo', 46.9611111111, 32.0361111111, 350, { osm: Object.freeze({ type: 'way', id: 195139929 }), wikidataId: 'Q4320477', type: 'poi.zoo' }),
  poi('shipbuilding-museum', 'Shipbuilding Museum', 46.97806, 31.9861, 180, { osm: Object.freeze({ type: 'way', id: 671847565 }), wikidataId: 'Q4306475', type: 'poi.museum' }),
  poi('varvarivskyi-bridge', 'Varvarivskyi Bridge', 46.98431, 31.9671, 280, { osm: Object.freeze({ type: 'way', id: 194078947 }), wikidataId: 'Q4103643', type: 'poi.bridge' }),
  poi('inhulskyi-bridge', 'Inhulskyi Bridge', 46.9813428, 31.9908123, 320, { osm: Object.freeze({ type: 'way', id: 52136681 }), type: 'poi.bridge' }),
]);
