const street = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kharkiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'street',
  accuracyM,
  ...extra,
});

export const UA_KHARKIV_STREET_ENTITIES = Object.freeze([
  street('sumska', 'Sumska Street', 50.012008, 36.242666, 2200, {
    wikidataId: 'Q4446038',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4446038',
  }),
  street('nauky-avenue', 'Nauky Avenue', 50.016667, 36.216667, 2600, {
    source: 'manual',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Nauky_Avenue,_Kharkiv',
  }),
  street('heroiv-kharkova-avenue', 'Heroiv Kharkova Avenue', 49.989444, 36.247222, 5000, {
    osm: Object.freeze({ type: 'relation', id: 1295889 }),
    wikidataId: 'Q4304257',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Heroiv_Kharkova_Avenue,_Kharkiv',
  }),
  street('saltivske-highway', 'Saltivske Highway', 49.988204, 36.339941, 5000, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/i/STR3KEVMFW6K',
    bbox: Object.freeze({ south: 49.986107, west: 36.285442, north: 49.999420, east: 36.382199 }),
  }),
  street('poltavskyi-shliakh', 'Poltavskyi Shliakh Street', 49.988500, 36.226470, 4200, {
    osm: Object.freeze({ type: 'relation', id: 2392273 }),
    wikidataId: 'Q4370811',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Poltavskyi_Shliakh_Street,_Kharkiv',
  }),
  street('klochkivska', 'Klochkivska Street', 49.990530, 36.227620, 4200, {
    osm: Object.freeze({ type: 'relation', id: 1419947 }),
    wikidataId: 'Q4224156',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Klochkivska_Street,_Kharkiv',
  }),
  street('hvardiitsiv-shyronintsiv', 'Hvardiitsiv-Shyronintsiv Street', 50.013056, 36.346944, 3600, {
    osm: Object.freeze({ type: 'relation', id: 1324398 }),
    wikidataId: 'Q20074979',
    sourceUrl: 'https://www.wikidata.org/wiki/Q20074979',
  }),
  street('yuvileinyi-avenue', 'Yuvileinyi Avenue', 49.996528, 36.334506, 3200, {
    osm: Object.freeze({ type: 'relation', id: 1544670 }),
    wikidataId: 'Q20091992',
    sourceUrl: 'https://www.wikidata.org/wiki/Q20091992',
  }),
  street('traktorobudivnykiv-avenue', 'Traktorobudivnykiv Avenue', 50.000000, 36.340833, 4700, {
    osm: Object.freeze({ type: 'relation', id: 1386634 }),
    wikidataId: 'Q95985900',
    sourceUrl: 'https://www.wikidata.org/wiki/Q95985900',
  }),
  street('lva-landau-avenue', 'Lva Landau Avenue', 49.939167, 36.294444, 5000, {
    osm: Object.freeze({ type: 'relation', id: 1570082 }),
    wikidataId: 'Q4381037',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4381037',
  }),
  street('aerokosmichnyi-avenue', 'Aerokosmichnyi Avenue', 49.926405, 36.272535, 6500, {
    osm: Object.freeze({ type: 'relation', id: 1703731 }),
    wikidataId: 'Q4381105',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4381105',
    bbox: Object.freeze({ south: 49.868320, west: 36.245120, north: 49.984490, east: 36.299950 }),
  }),
  street('amosova', 'Amosova Street', 49.982357, 36.348972, 2800, {
    source: 'manual',
    sourceUrl: 'https://tv.yandex.com/maps/147/kharkiv/house/vulytsia_amosova_26a/Z08YdQNoQEIFQFpjfXV5c39mYg%3D%3D/',
  }),
]);
