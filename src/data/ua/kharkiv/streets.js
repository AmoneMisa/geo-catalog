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
]);
