const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 260) => Object.freeze({
  id: `kz:kostanay:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:kostanay',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_KOSTANAY_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('altyn-arman', 'Алтын Арман', 53.2404075, 63.6092745, 485106107),
]);
