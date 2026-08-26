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

const pointPoi = (citySlug, slug, canonicalName, lat, lng, source, accuracyM = 220) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source,
  accuracy: 'poi',
  accuracyM,
});

export const UZ_TAIL_POI_ANCHORS = Object.freeze([
  osmPoi('chust', 'chust-bazaar', 'Chust Bazaar', 40.99732, 71.22677, 'way', 399882284, 120),
  osmPoi('beruniy', 'beruniy-bazaar', 'Beruniy Bazaar', 41.69063, 60.73921, 'way', 1177242145, 120),
  osmPoi('xonobod', 'xonobod-sanatorium', 'Xonobod Sanatorium', 40.80774, 72.98207, 'way', 600950022, 180),
  osmPoi('urgut', 'urgut-bazaar', 'Urgut Bazaar', 39.42980, 67.18403, 'way', 252886374, 160),
  osmPoi('asaka', 'uzauto-motors', 'UzAuto Motors', 40.65743, 72.23151, 'way', 27013443, 220),
  pointPoi('chartak', 'chartak-sanatorium', 'Chartak Sanatorium', 41.12665996, 71.79000821, 'official', 180),
  pointPoi('chartak', 'market', 'Market', 41.0740704, 71.8201754, 'manual', 260),
  pointPoi('denov', 'denov-bazaar', 'Denov Bazaar', 38.248681, 67.905277, 'official', 180),
]);
