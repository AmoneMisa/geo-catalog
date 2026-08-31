const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:almaty:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
});

export const KZ_ALMATY_DISTRICT_ENTITIES = Object.freeze([
  district('alatau', 'Alatau', 43.300431, 76.835395, 9000, 'https://yandex.kz/maps/ru/162/almaty/geo/alatau_audany/1486060737/'),
  district('almaly', 'Almaly', 43.254421, 76.902193, 4500, 'https://yandex.kz/maps/ru/162/almaty/geo/almaly_audany/53183671/'),
  district('auezov', 'Auezov', 43.226673, 76.845222, 5500, 'https://yandex.kz/maps/ru/162/almaty/geo/auezov_audany/53183669/'),
  district('bostandyk', 'Bostandyk', 43.210334, 76.903469, 9000, 'https://yandex.kz/maps/ru/162/almaty/geo/bostandyq_audany/53183673/'),
  district('zhetysu', 'Zhetysu', 43.287262, 76.923187, 6500, 'https://yandex.kz/maps/ru/162/almaty/geo/zhetisu_audany/53183674/'),
  district('medeu', 'Medeu', 43.21967, 76.96495, 12000, 'https://yandex.kz/maps/ru/162/almaty/geo/medeu_audany/53183670/'),
  district('nauryzbay', 'Nauryzbay', 43.186846, 76.831819, 10000, 'https://yandex.kz/maps/ru/162/almaty/geo/nauryzbay_audany/1488171037/'),
  district('turksib', 'Turksib', 43.343443, 76.973313, 8500, 'https://yandex.kz/maps/ru/162/almaty/geo/turksib_audany/53183672/'),
]);
