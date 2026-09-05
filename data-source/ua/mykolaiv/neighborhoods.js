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
  neighborhood('temvod', 'Temvod', 46.98184, 32.00603, 1200, { osm: Object.freeze({ type: 'node', id: 1979458687 }), wikidataId: 'Q12160438' }),
  neighborhood('viiskova-slobidka', 'Viiskova Slobidka', 46.97582, 32.02694, 1200, { osm: Object.freeze({ type: 'node', id: 1962656673 }) }),
  neighborhood('staryi-vodopii', 'Staryi Vodopii', 46.96664, 32.05294, 1300, { osm: Object.freeze({ type: 'node', id: 1979193765 }), wikidataId: 'Q4441027' }),
  neighborhood('shyroka-balka', 'Shyroka Balka', 46.91804, 32.04529, 1700, { osm: Object.freeze({ type: 'node', id: 1980719286 }), wikidataId: 'Q12171897' }),
  neighborhood('pivnichnyi', 'Pivnichnyi', 47.015963, 32.0058314, 1200, { osm: Object.freeze({ type: 'way', id: 185143769 }) }),
  neighborhood('raketne-urochyshche', 'Raketne Urochyshche', 46.9966326, 32.0207228, 1200, { osm: Object.freeze({ type: 'relation', id: 2474997 }) }),
  neighborhood('lisky', 'Lisky', 46.956532, 31.953388, 1200, { osm: Object.freeze({ type: 'relation', id: 2521994 }) }),
  neighborhood('varvarivka', 'Varvarivka', 46.99205, 31.941372, 1500, { osm: Object.freeze({ type: 'relation', id: 2416748 }) }),
  neighborhood('ternivka', 'Ternivka', 47.0309748, 32.0108171, 1500, { osm: Object.freeze({ type: 'relation', id: 7075007 }) }),
  neighborhood('kulbakyne', 'Kulbakyne', 46.914481, 32.0781889, 1200, { osm: Object.freeze({ type: 'node', id: 1980719290 }) }),
  neighborhood('novyi-vodopii', 'Novyi Vodopii', 46.951426, 32.0490579, 1200, { osm: Object.freeze({ type: 'relation', id: 2521722 }) }),
  neighborhood('velyka-korenykha', 'Velyka Korenykha', 46.943733, 31.892662, 1500, { osm: Object.freeze({ type: 'relation', id: 2535311 }) }),
  neighborhood('mala-korenykha', 'Mala Korenykha', 46.926174, 31.985592, 1400, { osm: Object.freeze({ type: 'relation', id: 2454923 }) }),
  // UA "ПТЗ" and RU "ЮТЗ" are lexical variants of the same physical quarter.
  neighborhood('pivdennyi-turbinnyi-zavod', 'Pivdennyi Turbinnyi Zavod', 46.9452588, 32.0417708, 1200, { osm: Object.freeze({ type: 'relation', id: 2521750 }) }),
]);
