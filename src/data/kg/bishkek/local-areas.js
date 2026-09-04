const localArea = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kg:bishkek:local-area:${slug}`,
  type: "local_area",
  country: "KG",
  canonicalName,
  parentId: "kg:bishkek",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 1000,
});

export const KG_BISHKEK_LOCAL_AREA_ENTITIES = Object.freeze([
  localArea("ak-ordo", "Ак-Ордо", 42.827464108, 74.485501408, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  localArea("ala-too-3", "Ала-Тоо 3", 42.837929417, 74.487041364, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  localArea("kirgiziya-1", "Киргизия-1", 42.811815014, 74.580575434, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Bishkek"),
]);
