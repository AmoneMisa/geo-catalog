const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:nizhyn:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:nizhyn',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_NIZHYN_POI_ENTITIES = Object.freeze([
  poi('railway-station', 'Nizhyn Railway Station', 51.01807, 31.88881, 160, {
    osm: Object.freeze({ type: 'node', id: 674334228 }),
    wikidataId: 'Q4316200',
    sourceUrl: 'https://www.openstreetmap.org/node/674334228',
    officialUrl: 'https://nizhyn-travel.com.ua/uk/pages/155-zaliznychnyj_vokzal_nizhyna',
  }),
  poi('local-history-museum', 'Ніжинський краєзнавчий музей імені Івана Спаського', 51.04673, 31.88389, 120, {
    osm: Object.freeze({ type: 'way', id: 366020793 }),
    wikidataId: 'Q12134577',
    sourceUrl: 'https://www.openstreetmap.org/way/366020793',
    officialUrl: 'https://nizhynrada.gov.ua/nmr/kultura/zakladi-kulturi-mista/4-nizhinskiy-krayeznavchiy-muzey-imeni-ivana-spaskogo',
  }),
  poi('post-station-museum', 'Ніжинська поштова станція', 51.04662, 31.8875, 120, {
    osm: Object.freeze({ type: 'way', id: 367351473 }),
    wikidataId: 'Q12130494',
    sourceUrl: 'https://www.openstreetmap.org/way/367351473',
    officialUrl: 'https://nizhynrada.gov.ua/nmr/kultura/ekskursiyne-obslugovuvannya',
  }),
  poi('mykola-gogol-state-university', 'Ніжинський державний університет імені Миколи Гоголя', 51.05324, 31.88132, 120, {
    source: 'manual',
    sourceUrl: 'https://discover.ua/locations/kartinna-galerea-nizinskogo-derzavnogo-universitetu-imeni-mikoli-gogola',
    officialUrl: 'https://www.ndu.edu.ua/index.php/ua/yniversutet/about-univer',
  }),
  poi('st-nicholas-cathedral', 'Свято-Миколаївський кафедральний собор', 51.04806, 31.88709, 80, {
    osm: Object.freeze({ type: 'way', id: 723396207 }),
    wikidataId: 'Q4320534',
    sourceUrl: 'https://www.openstreetmap.org/way/723396207',
    officialUrl: 'https://nizhin-sob.church.ua/kontakty/',
  }),
]);
