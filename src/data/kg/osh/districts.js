const osmDistrict = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1300) => Object.freeze({
  id: `kg:osh:district:${slug}`,
  type: 'district',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

// Kerme-Too is a current Osh municipal territory. OSM remains the spatial source
// for its anchor while the city hierarchy determines its semantic type.
export const KG_OSH_DISTRICT_ENTITIES = Object.freeze([
  osmDistrict('kerme-too', 'Керме-Тоо', 40.5105276, 72.7152939, 'relation', 19062465, 1300),
]);
