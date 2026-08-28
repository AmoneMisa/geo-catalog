const neighborhood = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:sumy:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:sumy',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  ...extra,
});

export const UA_SUMY_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('khimmistechko', 'Хіммістечко', 50.89029, 34.83369, 1200, { osm: Object.freeze({ type: 'node', id: 9350463925 }) }),
  neighborhood('10-microdistrict', '10 мікрорайон', 50.91314, 34.83157, 1100, { osm: Object.freeze({ type: 'way', id: 144277089 }) }),
  neighborhood('baranivka', 'Баранівка', 50.94281, 34.8502, 1700, { source: 'manual', sourceUrl: 'https://mapcarta.com/13771350', geonamesId: '712836' }),
  neighborhood('12-microdistrict', '12 мікрорайон', 50.90889, 34.83924, 1000, { osm: Object.freeze({ type: 'way', id: 1549878767 }) }),
  neighborhood('kurskyi', 'Курський', 50.93984, 34.77317, 1400, { osm: Object.freeze({ type: 'node', id: 4290194731 }) }),
  neighborhood('luka', 'Лука', 50.93283, 34.83362, 1500, { source: 'manual', sourceUrl: 'https://mapcarta.com/13960318', geonamesId: '807320' }),
  neighborhood('veretenivka', 'Веретенівка', 50.94359, 34.74607, 1600, { osm: Object.freeze({ type: 'node', id: 4290163086 }) }),
]);
