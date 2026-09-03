const poi = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:pryluky:poi:${slug}`,
  type: 'poi.landmark',
  country: 'UA',
  canonicalName,
  parentId: 'ua:pryluky',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_PRYLUKY_POI_ENTITIES = Object.freeze([
  poi('railway-station', 'Pryluky Railway Station', 50.581935, 32.384284, 90, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/i/POI202CG49P',
  }),
  poi('local-history-museum', 'Прилуцький краєзнавчий музей імені В. І. Маслова', 50.5957, 32.3819, 150, {
    source: 'manual',
    sourceUrl: 'https://museumpryluky.org.ua/contacts.html',
    officialUrl: 'https://museumpryluky.org.ua/',
  }),
  poi('nativity-theotokos-cathedral', 'Собор Різдва Пресвятої Богородиці', 50.59663, 32.38722, 80, {
    osm: Object.freeze({ type: 'way', id: 169223096 }),
    wikidataId: 'Q12154140',
    sourceUrl: 'https://www.openstreetmap.org/way/169223096',
    officialUrl: 'https://prk.city/catalog/company/795',
  }),
]);
