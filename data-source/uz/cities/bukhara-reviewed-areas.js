const osmMicrodistrict = (slug, canonicalName, lat, lng, osmNodeId, accuracyM = 700) => Object.freeze({
  id: `uz:bukhara:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/node/${osmNodeId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'node', id: osmNodeId }),
});

const mappedLocalArea = (slug, canonicalName, lat, lng, providerId, accuracyM = 900) => Object.freeze({
  id: `uz:bukhara:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:bukhara',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl: `https://2gis.uz/bukhara/geo/${providerId}`,
  accuracy: 'neighborhood',
  accuracyM,
});

export const BUKHARA_REVIEWED_AREA_ENTITIES = Object.freeze([
  mappedLocalArea('safedmuy', 'Жилмассив Сафедмуй', 39.735984, 64.421174, '70030076739476399'),
  osmMicrodistrict('5b-mikroraion', '5Б микрорайон', 39.7465498, 64.4128903, 3593587411),
  osmMicrodistrict('5v-mikroraion', '5В микрорайон', 39.74566, 64.4060994, 3593587413),
  osmMicrodistrict('6a-mikroraion', '6A микрорайон', 39.7376035, 64.4398669, 3593587414),
  osmMicrodistrict('6b-mikroraion', '6Б микрорайон', 39.7372975, 64.4309026, 3593587415),
  osmMicrodistrict('severnyy', 'Северный микрорайон', 39.7834957, 64.4442455, 3593630430, 850),
]);
