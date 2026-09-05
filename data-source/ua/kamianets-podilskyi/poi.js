const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kamianets-podilskyi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kamianets-podilskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KAMIANETS_PODILSKYI_POI_ENTITIES = Object.freeze([
  poi('old-castle', 'poi.fortress', 'Old Castle', 48.673333, 26.5625, 260, {
    osm: Object.freeze({ type: 'way', id: 274749273 }),
    wikidataId: 'Q2375603',
    sourceUrl: 'https://www.wikidata.org/wiki/Q2375603',
  }),
  poi('polskyi-rynok-square', 'poi.square', 'Polskyi Rynok Square', 48.67524, 26.57318, 180, {
    osm: Object.freeze({ type: 'way', id: 82591709 }),
    sourceUrl: 'https://www.openstreetmap.org/way/82591709',
  }),
  poi('armenian-market-square', 'poi.square', 'Armenian Market Square', 48.67325, 26.57252, 180, {
    osm: Object.freeze({ type: 'way', id: 170317489 }),
    sourceUrl: 'https://www.openstreetmap.org/way/170317489',
  }),
  poi('railway-station', 'poi.landmark', 'Kamianets-Podilskyi Railway Station', 48.688, 26.60203, 180, {
    osm: Object.freeze({ type: 'node', id: 368285260 }),
    wikidataId: 'Q4210847',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4210847',
  }),
]);
