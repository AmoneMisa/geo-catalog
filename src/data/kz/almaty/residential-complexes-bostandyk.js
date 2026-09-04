const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 180) => Object.freeze({
  id: `kz:almaty:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_ALMATY_BOSTANDYK_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('terracotta', 'Terracotta', 43.2364222, 76.8799060, 1430348605),
]);
