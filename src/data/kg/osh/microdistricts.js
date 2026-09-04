const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 650) => Object.freeze({
  id: `kg:osh:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_OSH_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('anar', 'Anar', 40.5190, 72.7680, 452175726),
  microdistrict('tuleyken', 'Tuleyken', 40.5220, 72.7650, 452175725),
]);
