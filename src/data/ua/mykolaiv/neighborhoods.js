const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:mykolaiv:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mykolaiv',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_MYKOLAIV_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('namiv', 'Namiv', 46.94911, 31.93903, 1400, { osm: Object.freeze({ type: 'node', id: 1979283393 }), wikidataId: 'Q4312786' }),
  neighborhood('sukhyi-fontan', 'Sukhyi Fontan', 46.97858, 31.96717, 1200, { osm: Object.freeze({ type: 'node', id: 1962892059 }) }),
  neighborhood('matviivka', 'Matviivka', 47.01468, 31.92356, 1800, { osm: Object.freeze({ type: 'node', id: 1915924792 }), wikidataId: 'Q4284589' }),
  neighborhood('soliani', 'Soliani', 46.99969, 31.9973, 1400, { osm: Object.freeze({ type: 'node', id: 1979284809 }), wikidataId: 'Q4428607' }),
  neighborhood('temvod', 'Temvod', 46.98333, 32, 1800, { source: 'manual', sourceUrl: 'https://mapcarta.com/13741034' }),
  neighborhood('viiskova-slobidka', 'Viiskova Slobidka', 46.97582, 32.02694, 1200, { osm: Object.freeze({ type: 'node', id: 1962656673 }) }),
  neighborhood('staryi-vodopii', 'Staryi Vodopii', 46.96664, 32.05294, 1300, { osm: Object.freeze({ type: 'node', id: 1979193765 }), wikidataId: 'Q4441027' }),
  neighborhood('shyroka-balka', 'Shyroka Balka', 46.91657, 32.04192, 1700, { source: 'manual', sourceUrl: 'https://mapcarta.com/13733796' }),
]);
