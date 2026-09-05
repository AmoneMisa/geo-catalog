const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 180) => Object.freeze({
  id: `kz:karaganda:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:karaganda',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_KARAGANDA_SOUTHEAST_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('trilistnik', 'Трилистник', 49.7984653, 73.1474285, 1328329016),
]);
