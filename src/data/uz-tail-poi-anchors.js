const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140) => ({
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

export const UZ_TAIL_POI_ANCHORS = Object.freeze([
  osmPoi('chust', 'chust-bazaar', 'Chust Bazaar', 40.99732, 71.22677, 'way', 399882284, 120),
  osmPoi('beruniy', 'beruniy-bazaar', 'Beruniy Bazaar', 41.69063, 60.73921, 'way', 1177242145, 120),
  osmPoi('xonobod', 'xonobod-sanatorium', 'Xonobod Sanatorium', 40.80774, 72.98207, 'way', 600950022, 180),
]);
