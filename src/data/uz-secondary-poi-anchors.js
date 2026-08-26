const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
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
  ...(wikidataId ? { wikidataId } : {}),
});

export const UZ_SECONDARY_POI_ANCHORS = Object.freeze([
  osmPoi('margilan', 'kumtepa-bazaar', 'Kumtepa Bazaar', 40.45504, 71.66594, 'way', 253749024, 180),
  osmPoi('almalyk', 'metallurg-stadium', 'Metallurg Stadium', 40.84495, 69.60070, 'way', 257413698, 170, 'Q5927465'),
  osmPoi('kokand', 'kokand-bazaar', 'Kokand Bazaar', 40.55218, 70.95907, 'way', 174506939, 190),
]);
