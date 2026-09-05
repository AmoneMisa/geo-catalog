const osmDistrict = (slug, canonicalName, lat, lng, osmRelationId, accuracyM = 6500) => Object.freeze({
  id: `kg:bishkek:district:${slug}`,
  type: 'district',
  country: 'KG',
  canonicalName,
  parentId: 'kg:bishkek',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/relation/${osmRelationId}`,
  accuracy: 'district',
  accuracyM,
  osm: Object.freeze({ type: 'relation', id: osmRelationId }),
});

export const KG_BISHKEK_DISTRICT_ENTITIES = Object.freeze([
  osmDistrict('pervomaisky', 'Pervomaisky', 42.8965725, 74.5804127, 15600026),
  osmDistrict('leninsky', 'Leninsky', 42.8180936, 74.5357741, 15600027),
  osmDistrict('oktyabrsky', 'Oktyabrsky', 42.8267552, 74.6420197, 15600028),
  osmDistrict('sverdlovsky', 'Sverdlovsky', 42.917986, 74.6155466, 15600029),
]);
