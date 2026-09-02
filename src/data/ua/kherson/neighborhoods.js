const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kherson:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kherson',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_KHERSON_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('tsentr', 'Tsentr', 46.6386597, 32.612576, 1500, { osm: Object.freeze({ type: 'node', id: 9402413514 }) }),
  neighborhood('tavriiskyi', 'Tavriiskyi', 46.672, 32.61752, 1800, { osm: Object.freeze({ type: 'node', id: 9402413508 }) }),
  neighborhood('tavriiskyi-2', 'Tavriiskyi-2', 46.67922, 32.62012, 1100, { osm: Object.freeze({ type: 'node', id: 9402413504 }) }),
  neighborhood('tavriiskyi-3', 'Tavriiskyi-3', 46.66707, 32.61651, 1100, { osm: Object.freeze({ type: 'node', id: 9402413506 }) }),
  neighborhood('tavriiskyi-4', 'Tavriiskyi-4', 46.66919, 32.62385, 1100, { osm: Object.freeze({ type: 'node', id: 9402413507 }) }),
  neighborhood('pivnichnyi', 'Pivnichnyi', 46.67696, 32.60189, 1500, { osm: Object.freeze({ type: 'node', id: 9402413483 }) }),
  neighborhood('shumenskyi', 'Shumenskyi', 46.64598, 32.56415, 1700, { osm: Object.freeze({ type: 'node', id: 9394331056 }) }),
  neighborhood('khbk', 'KhBK', 46.6625935, 32.6435207, 1500, { osm: Object.freeze({ type: 'relation', id: 4487768 }) }),
  neighborhood('zhytloselyshche', 'Zhytloselyshche', 46.64626, 32.58878, 1400, { osm: Object.freeze({ type: 'node', id: 8632583884 }) }),
  neighborhood('ostriv', 'Ostriv', 46.619, 32.58271, 1700, { osm: Object.freeze({ type: 'node', id: 8635895888 }) }),
  neighborhood('voienka', 'Voienka', 46.64634, 32.63856, 1200, { osm: Object.freeze({ type: 'node', id: 8632583883 }) }),
  neighborhood('mlyny', 'Mlyny', 46.64983, 32.62553, 1200, { osm: Object.freeze({ type: 'node', id: 8633116200 }) }),
  neighborhood('sukharne', 'Sukharne', 46.63521, 32.57717, 1300, { osm: Object.freeze({ type: 'node', id: 9402413510 }) }),
  neighborhood('sklotara', 'Sklotara', 46.676, 32.658, 1300, { osm: Object.freeze({ type: 'node', id: 8644202548 }) }),
]);
