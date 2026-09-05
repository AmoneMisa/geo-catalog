const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 900) => Object.freeze({
  id: `kg:jalal-abad:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:jalal-abad',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_JALAL_ABAD_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('kurmanbek', 'Микрорайон Курманбек', 40.9601102, 72.998529, 701776994),
]);
