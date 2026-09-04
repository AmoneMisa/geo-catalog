const microdistrict = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:karaganda:microdistrict:${slug}`,
  type: "microdistrict",
  country: "KZ",
  canonicalName,
  parentId: "kz:karaganda",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 800,
});

export const KZ_KARAGANDA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict("12-i-mikroraion", "12-й микрорайон", 49.894281445, 73.200096411, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("14-i-mikroraion", "14-й микрорайон", 49.892902675, 73.215118938, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("28-i-mikroraion", "28-й микрорайон", 49.782007955, 73.137842181, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("30-i-mikroraion", "30-й микрорайон", 49.765563196, 73.153457254, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Karaganda"),
  microdistrict("gulder-2", "Гульдер-2", 49.791016343, 73.165513594, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("imeni-mamraeva", "имени Мамраева", 49.843034303, 73.187458423, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("kungei", "Кунгей", 49.780507477, 73.168547738, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("orbita-1", "Орбита-1", 49.782933219, 73.131178913, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("orbita-2", "Орбита-2", 49.789372692, 73.135072403, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("stepnoi-1", "Степной-1", 49.780443022, 73.148752976, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("stepnoi-2", "Степной-2", 49.787081549, 73.144841050, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("stepnoi-3", "Степной-3", 49.789684964, 73.148910115, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  microdistrict("16-i-mikroraion", "16-й микрорайон", 49.8909363, 73.1914307, "https://www.openstreetmap.org/way/110019754"),
]);
