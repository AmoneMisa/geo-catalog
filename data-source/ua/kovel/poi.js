const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 180) => Object.freeze({
  id: `ua:kovel:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kovel',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
});

export const UA_KOVEL_POI_ENTITIES = Object.freeze([
  poi('railway-station', 'poi.landmark', 'Kovel Railway Station', 51.22133, 24.7124, 'way', 153777159, 160),
  poi('lesya-ukrainka-park', 'poi.park', 'Lesya Ukrainka Park', 51.21498, 24.71203, 'way', 85608578, 260),
]);
