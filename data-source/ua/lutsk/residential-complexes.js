const residential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 320) => Object.freeze({
  id: `ua:lutsk:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:lutsk',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_LUTSK_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('caramel-residence', 'Caramel Residence', 50.772933, 25.3638732, 'relation', 13458856),
  residential('panorama', 'Panorama', 50.7591643, 25.3401554, 'relation', 10205684),
  residential('supernova', 'Supernova', 50.7342211, 25.300766, 'relation', 11197476),
  residential('lutska-riviera', 'Lutska Riviera', 50.7438993, 25.3060293, 'way', 136722374),
]);
