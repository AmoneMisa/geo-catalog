const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:uzhhorod:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:uzhhorod',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_UZHHOROD_POI_ENTITIES = Object.freeze([
  poi('uzhhorod-castle', 'poi.fortress', 'Uzhhorod Castle', 48.621292, 22.306746, 'relation', 15762897, 220),
  poi('bozdosh-park', 'poi.park', 'Bozdosh Park', 48.6221015, 22.2668223, 'way', 133628307, 650),
  poi('horiany-rotunda', 'poi.religious_complex', 'Horiany Rotunda', 48.6062412, 22.3369107, 'way', 485760313, 160),
  poi('teatralna-square', 'poi.square', 'Teatralna Square', 48.6222742, 22.2983081, 'node', 9901139854, 160),
  poi('pedestrian-bridge', 'poi.bridge', 'Pedestrian Bridge', 48.6216441, 22.2980076, 'relation', 12992982, 180),
  poi('holy-cross-cathedral', 'poi.cathedral', 'Holy Cross Cathedral', 48.6229481, 22.3023334, 'way', 235603630, 160),
  poi('linden-alley', 'poi.park', 'Linden Alley', 48.6233204, 22.2939621, 'way', 1092591232, 300),
]);
