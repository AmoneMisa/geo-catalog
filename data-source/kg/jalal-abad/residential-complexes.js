const osmResidential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 260) => Object.freeze({
  id: `kg:jalal-abad:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:jalal-abad',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const KG_JALAL_ABAD_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  osmResidential('asman-residence-1', 'Асман Резиденс 1', 40.9317243, 72.9824201, 'way', 1358176211),
  osmResidential('asman-residence-9', 'Асман Резиденс 9', 40.9333119, 72.9802073, 'way', 1466812461),
]);
