const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:rivne:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:rivne',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_RIVNE_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('pivnichnyi', 'Pivnichnyi', 50.6360924, 26.2613639, 1300, { osm: Object.freeze({ type: 'node', id: 1482176555 }) }),
  neighborhood('yuvileinyi', 'Yuvileinyi', 50.6368269, 26.2106351, 1300, { osm: Object.freeze({ type: 'node', id: 6716199415 }) }),
  neighborhood('chervoni-hory', 'Chervoni Hory', 50.5902085, 26.300992, 1400, { osm: Object.freeze({ type: 'node', id: 9155090890 }) }),
  neighborhood('boyarka', 'Boyarka', 50.61791, 26.21277, 1300, { osm: Object.freeze({ type: 'node', id: 6720445712 }) }),
  neighborhood('tynne', 'Tynne', 50.60402, 26.19031, 1700, { osm: Object.freeze({ type: 'node', id: 6718442152 }) }),
  neighborhood('basiv-kut', 'Basiv Kut', 50.60506, 26.24148, 1600, { osm: Object.freeze({ type: 'node', id: 7930175834 }) }),
  neighborhood('shchaslyve', 'Shchaslyve', 50.59425, 26.26213, 1400, { osm: Object.freeze({ type: 'node', id: 6718487782 }) }),
  neighborhood('novyi-dvir', 'Novyi Dvir', 50.58338, 26.26085, 1600, { source: 'geonames' }),
]);
