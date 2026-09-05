const osmPoi = (citySlug, slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

export const UZ_KARAKALPAKSTAN_ANCHORS = Object.freeze([
  osmPoi('muynak', 'ship-cemetery', 'Ship Cemetery', 'poi.memorial', 43.78855, 59.03460, 'way', 348697797, 180, 'Q122359857'),
  osmPoi('muynak', 'aral-sea-museum', 'Aral Sea Museum', 'poi.museum', 43.78964, 59.03242, 'node', 6911874385, 100),
]);
