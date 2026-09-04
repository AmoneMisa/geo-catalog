const street = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:karaganda:street:${slug}`,
  type: "street",
  country: "KZ",
  canonicalName,
  parentId: "kz:karaganda",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "street",
  accuracyM: 2500,
});

export const KZ_KARAGANDA_STREET_ENTITIES = Object.freeze([
  street("okhotskaya-ulitsa", "Охотская улица", 49.812967000, 73.058409000, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  street("prospekt-nurkena-abdirova", "Проспект Нуркена Абдирова", 49.801894000, 73.090202000, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Karaganda"),
  street("ulitsa-mukanova", "Улица Муканова", 49.774862944, 73.150034780, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  street("ulitsa-naziry-turekulovoi", "Улица Назиры Турекуловой", 49.770555163, 73.172755867, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  street("ulitsa-ryskulova", "Улица Рыскулова", 49.768593655, 73.149438180, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Karaganda"),
  street("ulitsa-tattimbeta", "Улица Таттимбета", 49.795909163, 73.158171335, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
  street("ulitsa-chkalova", "Улица Чкалова", 49.813906322, 73.077586860, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Karaganda"),
]);
