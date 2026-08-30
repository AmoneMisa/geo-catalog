const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 110) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi.railway_station',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const UZ_HERITAGE_TRANSPORT_ENTITIES = Object.freeze([
  osmPoi('margilan', 'margilan-railway-station', 'Margilan Railway Station', 40.44258, 71.72309, 'node', 246213673),
  osmPoi('kokand', 'kokand-1-railway-station', 'Kokand Railway Station', 40.51901, 70.92847, 'node', 1587385859),
  osmPoi('khiva', 'khiva-railway-station', 'Khiva Railway Station', 41.37716, 60.37660, 'node', 5793725055),
]);
