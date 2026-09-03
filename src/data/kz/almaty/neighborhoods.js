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
  microdistrict('aksai-3a', 'Аксай-3А', 43.235587, 76.826564, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/aqsay_3a_shaghyn_audany/53183013/'),
  microdistrict('koktem-1', 'Коктем-1', 43.230089, 76.926385, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/koktem_1_shaghyn_audany/53183047/'),
  microdistrict('koktem-2', 'Коктем-2', 43.229498, 76.918489, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/koktem_2_shaghyn_audany/53183048/'),
  microdistrict('koktem-3', 'Коктем-3', 43.234161, 76.918111, 700, 'https://yandex.kz/maps/ru/162/almaty/geo/koktem_3_shaghyn_audany/53183049/'),
  microdistrict('zhetisu-1', 'Жетысу-1', 43.222876, 76.839392, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/zhetisu_1_shaghyn_audany/53183033/'),
  microdistrict('zhetisu-3', 'Жетысу-3', 43.219302, 76.842105, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/zhetisu_3_shaghyn_audany/53183035/'),
  microdistrict('orbita-2', 'Орбита-2', 43.196954, 76.884649, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/orbita_2_shaghyn_audany/53183064/'),
  microdistrict('orbita-4', 'Орбита-4', 43.196481, 76.877795, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/orbita_4_shaghyn_audany/53183066/'),
  microdistrict('mamyr-1', 'Мамыр-1', 43.211247, 76.845707, 800, 'https://yandex.kz/maps/ru/162/almaty/geo/mamyr_1_shaghyn_audany/53183054/'),
]);
