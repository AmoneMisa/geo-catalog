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
  neighborhood('khimmistechko', 'Khimhorodok', 50.89029, 34.83369, 1200, { osm: Object.freeze({ type: 'node', id: 9350463925 }) }),
  neighborhood('10-microdistrict', '10 microdistrict', 50.91314, 34.83157, 1100, { osm: Object.freeze({ type: 'way', id: 144277089 }) }),
  neighborhood('baranivka', 'Baranivka', 50.94281, 34.8502, 1700, { source: 'manual', sourceUrl: 'https://mapcarta.com/13771350', geonamesId: '712836' }),
  neighborhood('12-microdistrict', '12 microdistrict', 50.90889, 34.83924, 1000, { osm: Object.freeze({ type: 'way', id: 1549878767 }) }),
  neighborhood('kurskyi', 'Kurskyi', 50.93984, 34.77317, 1400, { osm: Object.freeze({ type: 'node', id: 4290194731 }) }),
  neighborhood('luka', 'Luka', 50.93283, 34.83362, 1500, { source: 'manual', sourceUrl: 'https://mapcarta.com/13960318', geonamesId: '807320' }),
  neighborhood('veretenivka', 'Veretenivka', 50.94359, 34.74607, 1600, { osm: Object.freeze({ type: 'node', id: 4290163086 }) }),
  neighborhood('dobrovilna', 'Dobrovilna', 50.93025, 34.76673, 1300, { osm: Object.freeze({ type: 'node', id: 4290194732 }) }),
  neighborhood('11-microdistrict', '11 microdistrict', 50.913303, 34.832885, 1000, { source: 'manual', sourceUrl: 'https://yandex.com/maps/965/sumy/geo/11_y_mikroraion/1570351272/' }),
  neighborhood('9-microdistrict', '9 microdistrict', 50.907753, 34.816032, 1100, { source: 'manual', sourceUrl: 'https://lun.ua/new/sumy/esplanada' }),
  neighborhood('romenskyi', 'Romenskyi', 50.895135, 34.760841, 1800, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/34.76167%2C50.89162%2C15/f/STR3KD1GXZIZ%3Flang%3Duk' }),
  neighborhood('teplychnyi', 'Teplychnyi', 50.928247, 34.741812, 1600, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/34.74184%2C50.92826%2C17/f/ADR3KD1GXZA0H5XQC1?lang=uk' }),
]);
