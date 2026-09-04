const residential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 260) => Object.freeze({
  id: `kg:osh:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const KG_OSH_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('asman-residence-1', 'Asman Residence 1', 40.5051476, 72.8122757, 'way', 1534183059, 320),
]);
