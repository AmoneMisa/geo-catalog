const poi = (slug, type, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:cherkasy:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:cherkasy',
  center: Object.freeze({ lat, lng }),
  source: extra.source ?? (extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : 'manual'),
  accuracy: 'poi',
  accuracyM,
  ...extra,
});

export const UA_CHERKASY_POI_ENTITIES = Object.freeze([
  poi('valley-of-roses', 'poi.park', 'Valley of Roses', 49.451, 32.0651, 450, { source: 'manual', sourceUrl: 'https://discover.ua/trips/pdf/neobychnye-cherkassy' }),
  poi('victory-park', 'poi.park', 'Victory Park', 49.415001, 32.025361, 700, { source: 'manual', sourceUrl: 'https://maps.visicom.ua/i/POI1198B8TE' }),
  poi('sosnovyi-bir', 'poi.park', 'Sosnovyi Bir', 49.46356, 32.03024, 900, { osm: Object.freeze({ type: 'way', id: 72051302 }) }),
  poi('chemists-park', 'poi.park', 'Chemists Park', 49.4068, 32.05087, 700, { osm: Object.freeze({ type: 'way', id: 103630841 }), wikidataId: 'Q16711012' }),
  poi('hill-of-glory', 'poi.memorial', 'Hill of Glory', 49.446708, 32.061996, 300, { source: 'manual', sourceUrl: 'https://discover.ua/trips/pdf/neobychnye-cherkassy' }),
  poi('cherkasy-zoo', 'poi.zoo', 'Cherkasy Zoo', 49.41595, 32.02196, 500, { osm: Object.freeze({ type: 'way', id: 454235298 }), wikidataId: 'Q10698900' }),
  poi('cherkasy-railway-station', 'poi.railway_station', 'Cherkasy Railway Station', 49.42601, 32.04991, 80, { osm: Object.freeze({ type: 'node', id: 1970581474 }), wikidataId: 'Q1771041' }),
  poi('cherkasy-bus-station-1', 'poi.bus_station', 'Cherkasy Bus Station No. 1', 49.40614, 32.017105, 80, { source: 'manual', sourceUrl: 'https://www.blablacar.com.ua/bus/stations/avtovokzal-novyi-cherkasy', address: 'вул. Смілянська, 166А' }),
]);
