const poi = (slug, type, canonicalName, lat, lng, osmType, osmId, accuracyM = 220) => Object.freeze({
  id: `ua:kryvyi-rih:poi:${slug}`,
  type,
  country: 'UA',
  canonicalName,
  parentId: 'ua:kryvyi-rih',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_KRYVYI_RIH_POI_ENTITIES = Object.freeze([
  poi('heroes-park', 'poi.park', 'Heroes Park', 47.9054466, 33.3901457, 'way', 124904286, 500),
  poi('botanical-garden', 'poi.botanical_garden', 'Kryvyi Rih Botanical Garden', 48.1498608, 33.5783384, 'way', 432919992, 900),
  poi('flower-clock', 'poi.landmark', 'Flower Clock', 47.9049828, 33.3920465, 'way', 127806414, 160),
]);
