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
  // Keep the listing-area label node separate from the Qiyot/C-5 residential
  // relation, which is already the physical owner of microdistrict:qiyot.
  osmLocalArea('kiyot', 'Qiyot', 41.32538, 69.27791, 'node', 4778058865, 320),
  // Yandex exposes Manzara mavzesi as a standalone Yunusabad locality; this is the locality center, not a residential-complex building anchor.
  {
    id: 'uz:tashkent:local-area:manzara',
    type: 'local_area',
    country: 'UZ',
    canonicalName: 'Manzara',
    parentId: 'uz:tashkent:yunusabad',
    center: { lat: 41.356428, lng: 69.315445 },
    source: 'manual',
    sourceUrl: 'https://yandex.uz/maps/10335/tashkent/geo/manzara_mavzesi/5758427583/panorama/',
    accuracy: 'approximate',
    accuracyM: 500,
  },
]);
