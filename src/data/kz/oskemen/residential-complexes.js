const residential = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 320) => Object.freeze({
  id: `kz:oskemen:residential:${slug}`,
  type: 'residential_complex',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:oskemen',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_OSKEMEN_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('oazis', 'Оазис', 49.8908572, 82.6196422, 935765142),
  residential('rakhat', 'Рахат', 49.8990903, 82.6049096, 661515788, 420),
  residential('renesans', 'Renesans', 49.9051038, 82.6068136, 1160677421, 360),
]);
