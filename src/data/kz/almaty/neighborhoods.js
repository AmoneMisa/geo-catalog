const microdistrict = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:almaty:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM,
});

export const KZ_ALMATY_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict('samal-1', 'Самал-1', 43.235731, 76.953963, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/samal_1_shaghyn_audany/53183069/'),
  microdistrict('samal-2', 'Самал-2', 43.231291, 76.954808, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/samal_2_shaghyn_audany/53183070/'),
  microdistrict('samal-3', 'Самал-3', 43.226818, 76.955993, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/samal_3_shaghyn_audany/53183071/inside/'),
  microdistrict('aksai-1', 'Аксай-1', 43.242305, 76.833239, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/aqsay_1_shaghyn_audany/53183008/'),
  microdistrict('koktem-1', 'Коктем-1', 43.230089, 76.926385, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/koktem_1_shaghyn_audany/53183047/'),
]);
