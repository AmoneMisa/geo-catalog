const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId, parentId = 'kg:osh') => Object.freeze({
  id: `kg:osh:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId,
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
  osmMicrodistrict('kulatov', 'Кулатов', 40.5177032, 72.7605313, 452186589, 'kg:osh:district:kerme-too'),
]);
