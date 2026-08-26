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

const manualPoi = (citySlug, slug, canonicalName, lat, lng, accuracyM = 260) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
});

export const UZ_INDUSTRIAL_ANCHORS = Object.freeze([
  osmPoi('almalyk', 'almalyk-mmc', 'Almalyk MMC', 40.83796, 69.55633, 'way', 257079907, 220),
  osmPoi('angren', 'angren-tpp', 'Angren TPP', 41.00605, 70.12520, 'way', 229924899, 220, 'Q25532238'),
  osmPoi('angren', 'yangi-angren-tpp', 'Yangi Angren TPP', 40.92244, 69.81373, 'way', 262167659, 260, 'Q25527702'),
  osmPoi('takhiatash', 'takhiatash-tpp', 'Takhiatash TPP', 42.31638, 59.55496, 'way', 531064358, 260, 'Q25520622'),
  osmPoi('shirin', 'syrdarya-tpp', 'Syrdarya TPP', 40.22823, 69.10034, 'way', 229824212, 260, 'Q607734'),
  manualPoi('bekabad', 'uzmetkombinat', 'Uzmetkombinat', 40.233432, 69.290873, 260),
]);
