const residential = (slug, canonicalName, lat, lng, osmId, accuracyM = 320) => Object.freeze({
  id: `ua:dnipro:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmId }),
});

export const UA_DNIPRO_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('nebo', 'Nebo', 48.463601, 35.06225, 1225643418, 320),
  residential('west-hall', 'West Hall', 48.4285198, 35.0649704, 887478103, 320),
]);
