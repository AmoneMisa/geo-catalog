const street = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 1800) => Object.freeze({
  id: `ua:chernihiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernihiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const UA_CHERNIHIV_REVIEWED_STREET_ENTITIES = Object.freeze([
  street('koty-lane', 'провулок Коти', 51.5276699, 31.2604199, 146827831),
  street('kvitky-tsisyk-lane', 'провулок Квітки Цісик', 51.5322833, 31.263258, 146827841),
  street('poliskyi-lane', 'провулок Поліський', 51.502865, 31.2712506, 1271828572),
  // Retyped from a lane search hit: the OSM way itself is explicitly a street.
  street('yevhena-onatskoho', 'вулиця Євгена Онацького', 51.5201137, 31.2639957, 107339142),
]);
