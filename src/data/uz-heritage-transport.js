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

const wikidataPoi = (citySlug, slug, canonicalName, lat, lng, wikidataId, accuracyM = 180) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

export const UZ_HERITAGE_TRANSPORT_ENTITIES = Object.freeze([
  wikidataPoi('khiva', 'itchan-kala', 'Itchan Kala', 41.378056, 60.359722, 'Q220560', 220),
  wikidataPoi('shakhrisabz', 'ak-saray-palace', 'Ak-Saray Palace', 39.057778, 66.829444, 'Q4183848', 180),
  osmPoi('kokand', 'khudayar-khan-palace', 'Palace of Khudayar Khan', 40.52855, 70.94202, 'way', 233726339, 120, 'Q1840803'),
  osmPoi('margilan', 'margilan-railway-station', 'Margilan Railway Station', 40.44258, 71.72309, 'node', 246213673, 110),
  osmPoi('kokand', 'kokand-1-railway-station', 'Kokand Railway Station', 40.51901, 70.92847, 'node', 1587385859, 110),
  osmPoi('khiva', 'khiva-railway-station', 'Khiva Railway Station', 41.37716, 60.37660, 'node', 5793725055, 110),
]);
