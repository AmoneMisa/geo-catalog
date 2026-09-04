const microdistrict = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kz:shymkent:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:shymkent',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM,
});

export const KZ_SHYMKENT_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict("18-i-mikroraion", "18-й микрорайон", 42.340993352, 69.629553314, 900, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent"),
  microdistrict("akzhaiyk", "Акжайык", 42.378879574, 69.600920823, 900, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent"),
  microdistrict("astana", "Астана", 42.355123255, 69.651703271, 900, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent"),
  microdistrict("sairam", "Сайрам", 42.339711874, 69.636264201, 900, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent"),
  microdistrict("sever", "Север", 42.338934815, 69.638336208, 900, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Shymkent"),
  microdistrict("sportivnyi", "Спортивный", 42.332094803, 69.598852544, 900, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Shymkent"),
  microdistrict("shymsiti", "Шымсити", 42.411559510, 69.614180439, 900, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20%D0%A8%D1%8B%D0%BC%D0%BA%D0%B5%D0%BD%D1%82"),
]);
