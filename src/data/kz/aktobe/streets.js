const street = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:aktobe:street:${slug}`,
  type: "street",
  country: "KZ",
  canonicalName,
  parentId: "kz:aktobe",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "street",
  accuracyM: 2500,
});

export const KZ_AKTOBE_STREET_ENTITIES = Object.freeze([
  street("prospekt-alash", "Проспект Алаш", 50.272833046, 57.114598723, "https://yandex.com/maps/?text=%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%2C%20Aktobe"),
  street("ulitsa-baiganina", "Улица Байганина", 50.285257477, 57.213193249, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  street("ulitsa-bokenbai-batyra", "Улица Бокенбай Батыра", 50.273034207, 57.193674388, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  street("ulitsa-dzhambula", "Улица Джамбула", 50.290665925, 57.228381402, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  street("ulitsa-zhankozha-batyra", "Улица Жанкожа Батыра", 50.282381236, 57.220340599, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  street("ulitsa-ibatova", "Улица Ибатова", 50.291292253, 57.165923469, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  street("ulitsa-mangilik-el", "Улица Мангилик Ел", 50.262841388, 57.150754832, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Aktobe"),
  street("ulitsa-oraza-tateuly", "улица Ораза Татеулы", 50.273707669, 57.136254266, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  street("ulitsa-pozharskogo", "Улица Пожарского", 50.309204431, 57.135860570, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  street("ulitsa-satpaeva", "Улица Сатпаева", 50.293312231, 57.149087972, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  street("ulitsa-uzakbaya-kulymbetova", "Улица Узакбая Кулымбетова", 50.288535712, 57.212410439, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%90%D2%9B%D1%82%D3%A9%D0%B1%D0%B5"),
]);
