const osmLocalArea = (slug, canonicalName, parentId, lat, lng, osmWayId, accuracyM = 700) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'way', id: osmWayId },
});

const manualLocalArea = (slug, canonicalName, parentId, lat, lng, accuracyM) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const TASHKENT_SERGELI_YANGIHAYOT_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('yangi-sergeli', 'Yangi Sergeli', 'uz:tashkent:sergeli', 41.2228385, 69.2252417, 516431539, 760),
  osmLocalArea('uzgarish', 'Uzgarish', 'uz:tashkent:sergeli', 41.2511102, 69.2239233, 82881043, 900),
  // The official Tashkent toponymic reference defines Sug'diyona mahalla and Sug'diyona mavzesi as separate identities and places the 2023 mavze inside the mahalla. Reuse the conservative mahalla representative point without claiming a mavze OSM owner.
  manualLocalArea('sugdiyona', "Sug'diyona", 'uz:tashkent:sergeli', 41.223284, 69.235013, 1500),
]);
