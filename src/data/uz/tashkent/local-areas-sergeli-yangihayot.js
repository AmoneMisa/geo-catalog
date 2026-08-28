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

const manualLocalArea = (slug, canonicalName, parentId, lat, lng, accuracyM = 2000) => ({
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
  osmLocalArea('yangi-sergeli', 'Yangi Sergeli', 'uz:tashkent:sergeli', 41.22292, 69.22462, 516431539, 760),
  osmLocalArea('uzgarish', 'Uzgarish', 'uz:tashkent:yangihayot', 41.25084, 69.22791, 82881043, 900),
  // Representative centroid from verified numbered Yo'ldosh/Sputnik mavze points.
  manualLocalArea('sputnik', 'Sputnik', 'uz:tashkent:yangihayot', 41.198542, 69.218634, 2200),
]);
