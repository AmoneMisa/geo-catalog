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
  microdistrict("3-i-mikroraion", "3-й микрорайон", 43.220477694, 76.852740886, 800, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Almaty"),
  microdistrict("sayaly", "Саялы", 43.305503376, 76.837638068, 800, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Almaty"),
  microdistrict("nur-alatau", "Нур Алатау", 43.155431579, 76.895066291, 800, "https://yandex.com/maps/?text=%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%2C%20Almaty"),
]);
