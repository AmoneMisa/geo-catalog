const osmStreet = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 2400) => Object.freeze({
  id: `ua:kyiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const UA_KYIV_REVIEWED_STREET_ENTITIES = Object.freeze([
  // The boulevard is split into multiple OSM ways. This segment is the closest
  // raw scrape result to the center of the ten matching Kyiv street segments.
  osmStreet('tarasa-shevchenko-boulevard', 'бульвар Тараса Шевченко', 50.4442305, 30.5078918, 895868109),
]);
