const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 500) => Object.freeze({
  id: `kg:karakol:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:karakol',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_KARAKOL_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('voshod', 'Voshod', 42.50267, 78.39659, 238825748),
]);
