const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 260) => Object.freeze({
  id: `kz:pavlodar:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:pavlodar',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_PAVLODAR_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('irina', 'Ирина', 52.2837429, 76.9840952, 564204478),
]);
