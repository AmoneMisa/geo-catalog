const residential = (slug, canonicalName, lat, lng, sourceUrl, osm, accuracyM = 180) => Object.freeze({
  id: `ua:chernihiv:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:chernihiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl,
  osm: Object.freeze(osm),
  accuracy: 'building',
  accuracyM,
});

export const UA_CHERNIHIV_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential(
    'masany',
    'Masany',
    51.5189427,
    31.2423529,
    'https://www.openstreetmap.org/way/1230300678',
    { type: 'way', id: 1230300678 },
    180,
  ),
]);
