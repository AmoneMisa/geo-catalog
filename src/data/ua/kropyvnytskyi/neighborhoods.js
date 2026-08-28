const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kropyvnytskyi:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kropyvnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_KROPYVNYTSKYI_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('kovalivka', 'Ковалівка', 48.51758, 32.25257, 1400, { osm: Object.freeze({ type: 'node', id: 2024655598 }), wikidataId: 'Q12111027' }),
  neighborhood('novomykolaivka', 'Новомиколаївка', 48.53393, 32.2619, 1500, { osm: Object.freeze({ type: 'node', id: 2047705329 }), wikidataId: 'Q12134110' }),
  neighborhood('balashivka', 'Балашівка', 48.52386, 32.23103, 1600, { osm: Object.freeze({ type: 'node', id: 2047705326 }), wikidataId: 'Q12080606' }),
  neighborhood('lelekivka', 'Лелеківка', 48.55669, 32.23356, 1700, { osm: Object.freeze({ type: 'node', id: 2047705328 }), wikidataId: 'Q12117560' }),
]);
