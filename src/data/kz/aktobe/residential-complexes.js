const residential = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:aktobe:residential:${slug}`,
  type: "residential_complex",
  country: "KZ",
  canonicalName,
  parentId: "kz:aktobe",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "building",
  accuracyM: 260,
});

export const KZ_AKTOBE_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential("garden-residence", "Garden Residence", 50.274811000, 57.193492000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("gold-square", "Gold Square", 50.309025000, 57.143747000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("grand-nomad", "Grand Nomad", 50.265042500, 57.150319500, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("araily", "Арайлы", 50.279491000, 57.198178000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%90%D2%9B%D1%82%D3%A9%D0%B1%D0%B5"),
  residential("astana-premium", "Астана Премиум", 50.268583000, 57.133956000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("daulet", "Даулет", 50.263952440, 57.134344187, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("domino", "Домино", 50.264769587, 57.147999822, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("zheti-kazyna", "Жети казына", 50.284287000, 57.212632000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%90%D2%9B%D1%82%D3%A9%D0%B1%D0%B5"),
  residential("koktem", "Коктем", 50.273474245, 57.154347958, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Aktobe"),
  residential("kuandyk", "Куандык", 50.288791000, 57.227361000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  residential("polina", "Полина", 50.285839000, 57.220167000, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  residential("skonur", "Сконур", 50.275378000, 57.139458000, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  residential("sunkar", "Сункар", 50.269737052, 57.161502375, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Aktobe"),
]);
