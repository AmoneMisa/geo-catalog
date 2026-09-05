const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kropyvnytskyi:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kropyvnytskyi',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_KROPYVNYTSKYI_POI_ENTITIES = Object.freeze([
  poi('heroes-of-maidan-square', 'poi.square', 'Heroes of Maidan Square', 48.509541, 32.26651, 260, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/32.26659%2C48.51027%2C17/f/STR3K20JYPG0?lang=uk' }),
  poi('kovalivskyi-park', 'poi.park', 'Kovalivskyi Park', 48.516533, 32.258992, 500, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/i/POI1MM0C0EZ' }),
  poi('st-elizabeth-fortress', 'poi.fortress', 'St Elizabeth Fortress', 48.49821, 32.25436, 700, { osm: Object.freeze({ type: 'way', id: 355793873 }), wikidataId: 'Q4240278', sourceUrl: 'https://discover.kr.ua/locations/fortecya-svyatoyi-ielisaveti' }),
  poi('dendropark', 'poi.park', 'Dendropark', 48.500523, 32.232135, 700, { wikidataId: 'Q12116600', source: 'manual', sourceUrl: 'https://travel.library.kr.ua/turmagnit/dendropark/' }),
  poi('kropyvnytskyi-theatre', 'poi.cultural_venue', 'Kropyvnytskyi Theatre', 48.514166, 32.258984, 180, { source: 'manual', sourceUrl: 'https://discover.kr.ua/locations/kropivnickij-akademicnij-oblasnij-ukrainskij-muzicno-dramaticnij-teatr-im-m-l-kropivnickogo' }),
  poi('velyka-perspektyvna', 'poi.street', 'Velyka Perspektyvna', 48.510656, 32.267505, 1200, { wikidataId: 'Q4091575', source: 'manual', sourceUrl: 'https://maps.visicom.ua/c/32.2667%2C48.51057%2C14/f/STR3K20JYOWF?lang=uk' }),
]);
