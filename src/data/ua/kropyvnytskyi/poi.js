const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kropyvnytskyi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kropyvnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KROPYVNYTSKYI_POI_ENTITIES = Object.freeze([
  poi('heroes-of-maidan-square', 'poi.square', 'Площа Героїв Майдану', 48.509541, 32.26651, 260, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/32.26659%2C48.51027%2C17/f/STR3K20JYPG0?lang=uk' }),
  poi('kovalivskyi-park', 'poi.park', 'Ковалівський парк', 48.516533, 32.258992, 500, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/i/POI1MM0C0EZ' }),
  poi('st-elizabeth-fortress', 'poi.fortress', 'Фортеця Святої Єлисавети', 48.49821, 32.25436, 700, { osm: Object.freeze({ type: 'way', id: 355793873 }), wikidataId: 'Q4240278', sourceUrl: 'https://discover.kr.ua/locations/fortecya-svyatoyi-ielisaveti' }),
]);
