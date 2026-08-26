const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 130) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const UZ_TASHKENT_REGION_CITY_ANCHORS = Object.freeze([
  osmPoi('angren', 'angren-railway-station', 'Angren Railway Station', 40.99905, 70.08266, 'node', 1412998292, 110),
  osmPoi('almalyk', 'olmaliq-bus-station', 'Olmaliq Bus Station', 40.86406, 69.59269, 'way', 257730061, 140),
]);
