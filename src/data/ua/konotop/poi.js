const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:konotop:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:konotop',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KONOTOP_POI_ENTITIES = Object.freeze([
  poi('railway-station', 'Konotop Railway Station', 51.224007, 33.187702, 80, {
    source: 'manual',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Konotop_-_Railway_station.JPG',
    wikidataId: 'Q4231184',
  }),
  poi('local-history-museum', 'Конотопський міський краєзнавчий музей ім. О. М. Лазаревського', 51.23892, 33.20492, 80, {
    source: 'manual',
    sourceUrl: 'https://travels.in.ua/uk-UA/object/4862/konotopskyy-krayeznavchyy-muzey-imeni-oleksandra-lazarevskoho',
    officialUrl: 'https://museum.mincult.gov.ua/museums/konotopskyy-miskyy-krayeznavchyy-muzey-im-o-m-lazarevskogo',
  }),
]);
