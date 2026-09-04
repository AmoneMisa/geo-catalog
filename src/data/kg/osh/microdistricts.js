const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId) => Object.freeze({
  id: `kg:osh:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM: 500,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_OSH_MICRODISTRICT_ENTITIES = Object.freeze([
  osmMicrodistrict('anar', 'Anar', 40.513245910405294, 72.81458115024875, 218603042),
  osmMicrodistrict('tuleyken', 'Tuleyken', 40.49496911801717, 72.81947115636904, 970988142),
]);
