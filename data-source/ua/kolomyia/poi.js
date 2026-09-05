const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kolomyia:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kolomyia',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KOLOMYIA_POI_ENTITIES = Object.freeze([
  poi('pysanka-museum', 'Pysanka Museum', 48.52835, 25.03906, 120, {
    osm: Object.freeze({ type: 'way', id: 161856502 }),
    wikidataId: 'Q746631',
    sourceUrl: 'https://www.openstreetmap.org/way/161856502',
    officialUrl: 'https://pysanka.museum/',
  }),
  poi('hutsulshchyna-pokuttia-museum', 'National Museum of Hutsulshchyna and Pokuttia Folk Art', 48.52877, 25.03762, 120, {
    osm: Object.freeze({ type: 'node', id: 548651097 }),
    sourceUrl: 'https://www.openstreetmap.org/node/548651097',
    officialUrl: 'https://hutsul.museum/',
  }),
  poi('railway-station', 'Kolomyia Railway Station', 48.53473, 25.05983, 160, {
    osm: Object.freeze({ type: 'node', id: 3166094761 }),
    wikidataId: 'Q20077869',
    sourceUrl: 'https://www.openstreetmap.org/node/3166094761',
  }),
]);
