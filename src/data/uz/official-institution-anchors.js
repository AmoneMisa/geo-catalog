const officialPoi = (citySlug, slug, canonicalName, lat, lng, accuracyM = 180, wikidataId = null, type = 'poi') => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'official',
  accuracy: 'poi',
  accuracyM,
  ...(wikidataId ? { wikidataId } : {}),
});

export const UZ_OFFICIAL_INSTITUTION_ANCHORS = Object.freeze([
  officialPoi('jizzakh', 'jizzakh-pedagogical-university', 'Jizzakh Pedagogical University', 40.1328231, 67.826403, 120, 'Q25533701', 'poi.university'),
  officialPoi('asaka', 'asaka-bank', 'Asaka Bank', 40.642372, 72.246818, 140, null, 'poi.bank'),
]);
