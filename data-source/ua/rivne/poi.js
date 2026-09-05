const poi = (slug, type, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:rivne:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:rivne',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
  sourceUrl,
});

export const UA_RIVNE_POI_ENTITIES = Object.freeze([
  poi('shevchenko-park', 'poi.park', 'Shevchenko Park', 50.61555556, 26.25888889, 900, 'https://travels.in.ua/uk-ua/object/2269/park-kultury-ta-vidpochynku-imeni-tarasa-shevchenka'),
  poi('molodi-park', 'poi.park', 'Molodi Park', 50.61774, 26.24779, 650, 'https://ua.igotoworld.com/projects/tic/rivne/'),
  poi('rivne-zoo', 'poi.zoo', 'Rivne Zoo', 50.610505, 26.330802, 700, 'https://travels.in.ua/map.php/object/655/rivnenskyy-zoopark'),
  poi('maidan-nezalezhnosti', 'poi.square', 'Maidan Nezalezhnosti', 50.61914, 26.25134, 320, 'https://oldpostcards.biz/uk/product/pam-jatnik-im-v-i-leninu-rivne-1978-rik/'),
  poi('teatralna-square', 'poi.square', 'Teatralna Square', 50.62048, 26.24598, 300, 'https://ua.igotoworld.com/projects/tic/rivne/'),
  poi('pokrovskyi-cathedral', 'poi.cathedral', 'Pokrovskyi Cathedral', 50.61777778, 26.26583333, 180, 'https://travels.in.ua/%2C/object/4170'),
  poi('organ-hall', 'poi.cultural_venue', 'Organ Hall', 50.619689, 26.2405443, 180, 'https://zabytki.in.ua/service/uk/location/object/577'),
  poi('rivne-drama-theatre', 'poi.cultural_venue', 'Rivne Drama Theatre', 50.6208668685, 26.2459950111, 180, 'https://maps.visicom.ua/c/26.24492%2C50.62104%2C17/f/POIK4DC0ZK?lang=uk'),
  poi('rivne-railway-station', 'poi.landmark', 'Rivne Railway Station', 50.6276246, 26.24002, 220, 'https://schedules.czech-transport.com/en/5?stop=RIVNE_ST'),
]);
