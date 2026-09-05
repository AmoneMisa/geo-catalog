const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:zhytomyr:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:zhytomyr',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_ZHYTOMYR_POI_ENTITIES = Object.freeze([
  poi('castle-hill', 'poi.landmark', 'Castle Hill', 50.25432, 28.65444, 300, {
    osm: Object.freeze({ type: 'node', id: 8328164792 }), wikidataId: 'Q98347842',
  }),
  poi('cosmonautics-museum', 'poi.museum', 'Cosmonautics Museum', 50.25296, 28.67764, 120, {
    osm: Object.freeze({ type: 'way', id: 220715229 }), wikidataId: 'Q538095',
  }),
  poi('korolov-museum', 'poi.museum', 'Korolov Museum', 50.25359, 28.67795, 100, {
    osm: Object.freeze({ type: 'way', id: 220715222 }),
  }),
  poi('chatsky-rock', 'poi.landmark', 'Chatsky Rock', 50.24075, 28.64476, 140, {
    osm: Object.freeze({ type: 'node', id: 4838586834 }), wikidataId: 'Q25434119',
  }),
  poi('hydropark', 'poi.park', 'Hydropark', 50.23772, 28.60607, 1200, {
    source: 'manual', sourceUrl: 'https://www.mypacer.com/parks/145568/gidropark-zhytomyr',
  }),
  poi('soborna-square', 'poi.square', 'Soborna Square', 50.25587, 28.660497, 260, {
    source: 'manual', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Soborna_square_in_Zhytomyr.jpg',
  }),
]);
