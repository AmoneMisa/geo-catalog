const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:aktobe:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktobe',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
});

export const KZ_AKTOBE_DISTRICT_ENTITIES = Object.freeze([
  district('astana', 'Astana', 50.295780, 57.139345, 15000, 'https://2gis.kz/aktobe/directions/points/%7C57.139345%2C50.29578%3B70030076156805309'),
  district('almaty', 'Almaty', 50.325221, 57.335485, 15000, 'https://yandex.kz/maps/20273/aktobe/house/saryzhaylau_koshesi_20b/YU4YdQRlTU0CQFtqfX9zdH5hZQ%3D%3D/inside/'),
]);
