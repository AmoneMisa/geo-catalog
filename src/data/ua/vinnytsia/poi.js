const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:vinnytsia:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:vinnytsia',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_VINNYTSIA_POI_ENTITIES = Object.freeze([
  poi('central-park', 'poi.park', 'Central Park', 49.2358333333, 28.4544444444, 650, { wikidataId: 'Q12168445' }),
  poi('roshen-fountain', 'poi.landmark', 'Roshen Fountain', 49.23279, 28.48566, 180, { osm: Object.freeze({ type: 'way', id: 129087304 }), wikidataId: 'Q15092053' }),
  poi('vinnytsia-tower', 'poi.landmark', 'Vinnytsia Tower', 49.23493, 28.46965, 120, { osm: Object.freeze({ type: 'way', id: 47054973 }), wikidataId: 'Q12090095' }),
  poi('pyrohov-museum', 'poi.landmark', 'Pyrohov Museum', 49.2160305556, 28.408375, 300, { wikidataId: 'Q4306061' }),
  poi('european-square', 'poi.landmark', 'European Square', 49.234653, 28.468743, 220, { source: 'manual', sourceUrl: 'https://vinnytsia.city/yevropejska-ploshha/' }),
]);
