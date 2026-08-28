const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:poltava:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:poltava',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_POLTAVA_POI_ENTITIES = Object.freeze([
  poi('korpusnyi-garden', 'poi.park', 'Korpusnyi Garden', 49.58964, 34.55106, 450, { source: 'manual', sourceUrl: 'https://find-way.com.ua/ru/oblasti/poltavskaya/poltava/korpusnyj-sad-poltava' }),
  poi('white-arbor', 'poi.landmark', 'White Arbor', 49.58152, 34.56957, 120, { osm: Object.freeze({ type: 'way', id: 165189776 }), wikidataId: 'Q4398661' }),
  poi('peremoha-park', 'poi.park', 'Peremoha Park', 49.57669, 34.56183, 750, { source: 'manual', sourceUrl: 'https://commons.wikimedia.org/wiki/User:Aced/WLE-2019_UA/Day_8' }),
  poi('poltava-dendropark', 'poi.park', 'Poltava Dendropark', 49.62214, 34.55016, 1800, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/34.550157%2C49.622138%2C17/f/POIFQO7A59?lang=uk', wikidataId: 'Q12141924' }),
  poi('poltava-battle-museum', 'poi.landmark', 'Poltava Battle Museum', 49.63038, 34.55329, 180, { osm: Object.freeze({ type: 'way', id: 124087844 }) }),
  poi('poltava-battle-field', 'poi.landmark', 'Poltava Battle Field', 49.62953, 34.54304, 1200, { osm: Object.freeze({ type: 'way', id: 123270875 }) }),
]);
