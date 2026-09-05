const boulevard = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 2200) => Object.freeze({
  id: `ua:dnipro:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:dnipro',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const UA_DNIPRO_REVIEWED_BOULEVARD_ENTITIES = Object.freeze([
  // Multi-segment OSM streets use one representative central way as the owner anchor.
  boulevard('bataliona-dnepr', 'Батальона «Днепр» бульвар', 48.4617712, 35.0215693, 652890049),
  boulevard('slavy', 'Славы бульвар', 48.4116519, 35.0629973, 92495343, 3200),
  boulevard('zvezdnyi', 'Звёздный бульвар', 48.4283115, 35.0173048, 345799643),
  boulevard('teatralnyi', 'Театральный бульвар', 48.4674793, 35.0444704, 28351013),
  boulevard('chernovola', 'Черновола бульвар', 48.4572697, 35.0111834, 680692237),
  boulevard('kelnskii', 'Кельнський бульвар', 48.4610021, 35.0500527, 217643987),
]);
