const osmResidential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 260) => Object.freeze({
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

const mappedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 220) => Object.freeze({
  id: `kg:osh:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

export const KG_OSH_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  osmResidential('asman-residence-1', 'Asman Residence 1', 40.5051476, 72.8122757, 'way', 1534183059, 320),
  mappedResidential('mon-paris', 'Mon Paris', 40.5152140, 72.8126340, 'https://2gis.kg/osh/directions/points/%7C72.812634%2C40.515214%3B70000001045267673', 180),
]);
