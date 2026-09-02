const street = (slug, canonicalName, lat, lng, osmId, accuracyM = 1400) => Object.freeze({
  id: `ua:dnipro:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmId }),
});

export const UA_DNIPRO_STREET_ENTITIES = Object.freeze([
  street('oleksandra-polia-avenue', 'Oleksandra Polia Avenue', 48.4496062, 35.0205245, 987361685, 2200),
  street('naberezhna-peremohy', 'Naberezhna Peremohy', 48.4576224, 35.0781845, 843985207, 3000),
]);
