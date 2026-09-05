const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:drohobych:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:drohobych',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_DROHOBYCH_POI_ENTITIES = Object.freeze([
  poi('st-georges-church', "St. George's Church", 49.34777, 23.49933, 120, {
    osm: Object.freeze({ type: 'way', id: 153376886 }),
    wikidataId: 'Q1992190',
    sourceUrl: 'https://www.openstreetmap.org/way/153376886',
  }),
  poi('saltworks', 'Drohobych Saltworks', 49.348517, 23.498613, 180, {
    source: 'manual',
    sourceUrl: 'https://travels.in.ua/en-US/object/3026/drohobych-salt-plant',
    officialUrl: 'https://drohobych-saltworks.com/en/en-contacts/',
  }),
  poi('railway-station', 'Drohobych Railway Station', 49.355, 23.54371, 160, {
    osm: Object.freeze({ type: 'node', id: 1740603139 }),
    wikidataId: 'Q16698333',
    sourceUrl: 'https://www.openstreetmap.org/node/1740603139',
  }),
]);
