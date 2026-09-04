const osmPoi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM, wikidataId = null) => Object.freeze({
  id: `kz:shymkent:poi:${slug}`,
  type,
  country: 'KZ',
  canonicalName,
  parentId: 'kz:shymkent',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  ...(wikidataId ? { wikidataId } : {}),
});

export const KZ_SHYMKENT_POI_ENTITIES = Object.freeze([
  osmPoi('shymkent-zoo', 'poi.zoo', 'Shymkent Zoo', 42.383333, 69.625556, 'way', 164667870, 900, 'Q1046034'),
  osmPoi('shymkent-international-airport', 'poi.airport', 'Shymkent International Airport', 42.365, 69.476111, 'way', 112117550, 1800, 'Q27315'),
  osmPoi('shymkent-railway-station', 'poi.railway_station', 'Shymkent Railway Station', 42.29871, 69.6103, 'node', 2753413127, 220),
]);
