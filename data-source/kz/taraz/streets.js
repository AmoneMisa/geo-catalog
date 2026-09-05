const street = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:taraz:street:${slug}`,
  type: "street",
  country: "KZ",
  canonicalName,
  parentId: "kz:taraz",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "street",
  accuracyM: 2500,
});

export const KZ_TARAZ_STREET_ENTITIES = Object.freeze([
  street("prospekt-zhambyla", "Проспект Жамбыла", 42.915555345, 71.375067078, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%A2%D0%B0%D1%80%D0%B0%D0%B7"),
  street("ulitsa-barbyusa", "Улица Барбюса", 42.922124332, 71.374528247, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%A2%D0%B0%D1%80%D0%B0%D0%B7"),
  street("ulitsa-zhusipa-balasaguna", "Улица Жусипа Баласагуна", 42.920046976, 71.378867406, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%A2%D0%B0%D1%80%D0%B0%D0%B7"),
  street("ulitsa-pushkina", "Улица Пушкина", 42.915652912, 71.375705173, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%A2%D0%B0%D1%80%D0%B0%D0%B7"),
]);
