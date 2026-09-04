const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 1000) => Object.freeze({
  id: `kz:taraz:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:taraz',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_TARAZ_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('uly-dala', 'Улы Дала', 42.9282803, 71.3474346, 1202753002),
]);
