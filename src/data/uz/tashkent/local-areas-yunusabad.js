const osmLocalArea = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 320) => ({
  id: `uz:tashkent:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent:yunusabad',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

export const TASHKENT_YUNUSABAD_LOCAL_AREA_ENTITIES = Object.freeze([
  osmLocalArea('kashgar', 'Kashgar', 41.32022, 69.27649, 'node', 1866932729, 320),
  // Preserve the existing stable entity id while upgrading the physical owner
  // from the point label to the explicit Qiyot (C-5) residential relation.
  osmLocalArea('kiyot', 'Qiyot', 41.3253801, 69.2779082, 'relation', 2351549, 420),
  // Yandex exposes Manzara mavzesi as a standalone Yunusabad locality; this is the locality center, not a residential-complex building anchor.
  {
    id: 'uz:tashkent:local-area:manzara',
    type: 'local_area',
    country: 'UZ',
    canonicalName: 'Manzara',
    parentId: 'uz:tashkent:yunusabad',
    center: { lat: 41.356428, lng: 69.315445 },
    source: 'manual',
    accuracy: 'approximate',
    accuracyM: 500,
  },
]);
