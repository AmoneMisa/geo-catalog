const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:shymkent:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:shymkent',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
});

export const KZ_SHYMKENT_DISTRICT_ENTITIES = Object.freeze([
  district('abai', 'Abai', 42.383847, 69.576648, 10000, 'https://yandex.com/maps/221/chimkent/geo/abay_audany/1958127539/'),
  district('al-farabi', 'Al-Farabi', 42.321368, 69.603094, 7000, 'https://yandex.kz/maps/221/chimkent/geo/al_farabi_audany/1958112779/'),
  district('enbekshi', 'Enbekshi', 42.294763, 69.637221, 10000, 'https://yandex.com/maps/221/chimkent/geo/engbekshi_audany/1957854189/'),
  district('karatau', 'Karatau', 42.359601, 69.643258, 11000, 'https://yandex.com/maps/221/chimkent/geo/qaratau_audany/1958211689/'),
  district('turan', 'Turan', 42.328320, 69.570422, 10000, 'https://yandex.kz/maps/221/chimkent/geo/turan_audany/5467599717/'),
]);
