const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:karaganda:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:karaganda',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
});

export const KZ_KARAGANDA_DISTRICT_ENTITIES = Object.freeze([
  district('kazybek-bi', 'Kazybek Bi', 49.806, 73.095, 12000, 'https://geo.qarobl.kz/'),
  district('alikhan-bokeikhan', 'Alikhan Bokeikhan', 49.884276, 73.190121, 11000, 'https://yandex.kz/maps/164/karaganda/geo/alikhan_bokeykhan_audany/1581468744/'),
]);
