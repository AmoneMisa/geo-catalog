const residential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 320) => Object.freeze({
  id: `ua:poltava:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:poltava',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_POLTAVA_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('standard', 'Standard', 49.5709983, 34.4905521, 'way', 871626491, 360),
  residential('peliustkovyi', 'Peliustkovyi', 49.6063171, 34.4834486, 'way', 1227161416, 320),
  residential('dynastiia', 'Dynastiia', 49.5662198, 34.5283578, 'way', 1227365611, 260),
  residential('city-park', 'City Park', 49.6028055, 34.5333258, 'way', 1227191408, 360),
]);
