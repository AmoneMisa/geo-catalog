const osmLocalArea = (slug, canonicalName, lat, lng, osmId, accuracyM = 650) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yashnobod',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: 'node', id: osmId },
});

export const TASHKENT_YASHNOBOD_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('aviasozlar-1', 'Aviasozlar-1', 41.28568, 69.35501, 8372975872),
  osmLocalArea('aviasozlar-2', 'Aviasozlar-2', 41.28230, 69.34583, 1867257404),
  osmLocalArea('aviasozlar-3', 'Aviasozlar-3', 41.28747, 69.34146, 1867257433),
  osmLocalArea('aviasozlar-4', 'Aviasozlar-4', 41.29609, 69.34548, 1867257440),
  osmLocalArea('tashselmash', 'Tashselmash', 41.3054111, 69.3067984, 6123092387, 650),
]);
