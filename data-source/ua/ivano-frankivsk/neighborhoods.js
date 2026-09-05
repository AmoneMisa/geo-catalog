const neighborhood = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 1100) => Object.freeze({
  id: `ua:ivano-frankivsk:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UA',
  canonicalName,
  parentId: 'ua:ivano-frankivsk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_IVANO_FRANKIVSK_NEIGHBORHOOD_ENTITIES = Object.freeze([
  neighborhood('pasichna', 'Pasichna', 48.9428009, 24.6960737, 'node', 2916052026),
  neighborhood('bam', 'BAM', 48.9057799, 24.6873276, 'node', 2959363634),
  neighborhood('kaskad', 'Kaskad', 48.9349426, 24.7508631, 'way', 795691238, 1200),
  neighborhood('pozitron', 'Pozitron', 48.9403831, 24.7425083, 'node', 2959363641),
  neighborhood('knyahynyn', 'Knyahynyn', 48.9341586, 24.708096, 'node', 4056909194),
  neighborhood('vovchynets', 'Vovchynets', 48.950531, 24.744669, 'relation', 2362665, 1500),
  neighborhood('opryshivtsi', 'Opryshivtsi', 48.8868983, 24.7151143, 'node', 2916052025),
  neighborhood('sofiivka', 'Sofiivka', 48.934095, 24.7374125, 'node', 2916052027),
  neighborhood('maizli', 'Maizli', 48.9184186, 24.732546, 'node', 3518426593),
  neighborhood('braty', 'Braty', 48.9218591, 24.7399798, 'node', 2959363635),
  neighborhood('hirka', 'Hirka', 48.9305265, 24.7289626, 'node', 4056909192),
]);
