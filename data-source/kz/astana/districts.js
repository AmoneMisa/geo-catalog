const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:astana:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:astana',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'district',
  accuracyM,
});

export const KZ_ASTANA_DISTRICT_ENTITIES = Object.freeze([
  district('almaty', 'Almaty', 51.165403, 71.559706, 9000, 'https://yandex.kz/maps/ru/163/astana/geo/almaty_audany/53183677/'),
  district('baikonur', 'Baikonur', 51.167679, 71.449536, 7500, 'https://yandex.kz/maps/ru/163/astana/geo/bayqongyr_audany/3505854285/'),
  district('esil', 'Esil', 51.091241, 71.458519, 11000, 'https://yandex.kz/maps/ru/162/almaty/geo/esil_audany/53183675/'),
  district('nura', 'Nura', 51.132576, 71.362112, 11000, 'https://yandex.kz/maps/ru/163/astana/geo/nura_audany/4912344826/'),
  district('saraishyk', 'Saraishyk', 51.116917, 71.564727, 10000, 'https://yandex.kz/maps/ru/163/astana/geo/sarayshyq_audany/5863346247/'),
  district('saryarka', 'Saryarka', 51.189164, 71.356273, 9500, 'https://yandex.kz/maps/ru/163/astana/geo/saryarqa_audany/53183676/'),
]);
