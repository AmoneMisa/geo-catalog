const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:chernihiv:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernihiv',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_CHERNIHIV_POI_ENTITIES = Object.freeze([
  poi('boldyni-hory', 'poi.park', 'Boldyni Hory', 51.4779, 31.283, 650, { osm: Object.freeze({ type: 'way', id: 95208314 }) }),
  poi('krasna-square', 'poi.landmark', 'Krasna Square', 51.49099, 31.29867, 220, { osm: Object.freeze({ type: 'way', id: 106549483 }), wikidataId: 'Q4238143' }),
  poi('yalivshchyna', 'poi.park', 'Yalivshchyna', 51.5232, 31.29623, 1500, { osm: Object.freeze({ type: 'way', id: 1385972786 }), wikidataId: 'Q60174761' }),
  poi('transfiguration-cathedral', 'poi.cathedral', 'Transfiguration Cathedral', 51.48903, 31.30764, 120, { osm: Object.freeze({ type: 'way', id: 53580282 }), wikidataId: 'Q1165571' }),
  poi('anthony-caves', 'poi.landmark', 'Anthony Caves', 51.4777, 31.2843, 250, { osm: Object.freeze({ type: 'node', id: 1802866501 }) }),
  poi('yeletskyi-monastery', 'poi.landmark', 'Yeletskyi Monastery', 51.48568, 31.29542, 320, { osm: Object.freeze({ type: 'way', id: 95267465 }), wikidataId: 'Q4174765' }),
]);
