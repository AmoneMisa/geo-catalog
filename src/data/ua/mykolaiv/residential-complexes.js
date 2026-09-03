const residentialComplex = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:mykolaiv:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:mykolaiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_MYKOLAIV_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residentialComplex('riviera', 'Riviera', 46.9437422, 31.9398684, 'way', 1227154323, 500),
  residentialComplex('grand-deluxe', 'Grand DeLuxe', 46.9611323, 32.0012716, 'way', 198061398, 260),
  residentialComplex('premier-house', 'Premier House', 46.9629506, 32.0088209, 'way', 1232175621, 180),
  residentialComplex('pivnichna-zirka', 'Pivnichna Zirka', 47.0176351, 32.0011925, 'way', 1230303386, 220),
]);
