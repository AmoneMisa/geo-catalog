const residential = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kg:bishkek:residential:${slug}`,
  type: "residential_complex",
  country: "KG",
  canonicalName,
  parentId: "kg:bishkek",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "building",
  accuracyM: 260,
});

export const KG_BISHKEK_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential("dastan-city", "Dastan City", 42.817801000, 74.635432000, "https://www.dastancity.kg/"),
  residential("diamond-park", "Diamond park", 42.844260000, 74.569040000, "https://dp.kg/home/"),
  residential("neo-city", "Neo City", 42.828416000, 74.597799000, "https://www.house.kg/index.php/jilie-kompleksy/https-www-instagram-com-neocity-kg"),
  residential("one", "One", 42.823501000, 74.583920000, "https://korter.kg/%D0%B6%D0%BA-one-%D0%B1%D0%B8%D1%88%D0%BA%D0%B5%D0%BA"),
  residential("prime-park", "Prime Park", 42.819224500, 74.613008000, "https://offer-prime.nurzaman.kg/"),
  residential("kreiser", "Крейсер", 42.818567000, 74.604957000, "https://www.house.kg/jilie-kompleksy/kreiser"),
  residential("siren", "Сирень", 42.828757000, 74.555362000, "https://arso.kg/siren22"),
  residential("tyan-shan", "Тянь-Шань", 42.826373753, 74.591203267, "https://yandex.com/maps/?text=%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%2C%20Bishkek"),
  residential("erkindik", "Эркиндик", 42.864989000, 74.606723000, "https://korter.kg/%D0%B6%D0%BA-%D0%B0%D0%BB%D0%B0-%D1%82%D0%BE%D0%BE-grand-%D0%B1%D0%B8%D1%88%D0%BA%D0%B5%D0%BA"),
  residential("yug-7", "Юг-7", 42.827601000, 74.621730000, "https://korter.kg/%D0%B6%D0%BA-%D1%8E%D0%B3-7-%D0%B1%D0%B8%D1%88%D0%BA%D0%B5%D0%BA"),
]);
