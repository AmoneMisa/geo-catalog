const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 260) => Object.freeze({
  id: `kz:taraz:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:taraz',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_TARAZ_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('atshabar', 'Атшабар', 42.9019676, 71.3709539, 230561121, 320),
]);
