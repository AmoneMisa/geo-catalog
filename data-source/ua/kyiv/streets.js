const street = (slug, canonicalName, lat, lng, osmId, accuracyM = 2200) => Object.freeze({
  id: `ua:kyiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmId }),
});

export const UA_KYIV_STREET_ENTITIES = Object.freeze([
  street('khreshchatyk', 'Khreshchatyk Street', 50.4492989, 30.5230211, 1131981872, 2400),
  street('saksahanskoho', 'Saksahanskoho Street', 50.4375631, 30.5045705, 813679928, 2600),
  street('antonovycha', 'Antonovycha Street', 50.4175517, 30.5201655, 130669991, 3200),
  street('lesi-ukrainky-boulevard', 'Lesi Ukrainky Boulevard', 50.4272602, 30.5395764, 1122570213, 2800),
  street('hlybochytska', 'Hlybochytska Street', 50.4623713, 30.5015844, 495491067, 2400),
  // Mykoly Bazhana Avenue is split into many OSM ways. Keep one representative
  // trunk segment as the physical anchor for the lexicon street canonical.
  street('mykoly-bazhana-avenue', 'Mykoly Bazhana Avenue', 50.3993088, 30.6397361, 1064063839, 5200),
]);
