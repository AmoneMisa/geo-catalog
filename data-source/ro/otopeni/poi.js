const osmPoi = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId) => Object.freeze({
  id: `ro:otopeni:poi:${slug}`,
  type: 'poi.airport',
  country: 'RO',
  canonicalName,
  parentId: 'ro:otopeni',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  wikidataId,
});

export const RO_OTOPENI_POI_ENTITIES = Object.freeze([
  osmPoi('henri-coanda-international-airport', 'Bucharest Henri Coandă International Airport', 44.56835, 26.10238, 'way', 84575372, 2200, 'Q257631'),
]);
