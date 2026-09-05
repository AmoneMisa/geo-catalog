const microdistrict = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kg:bishkek:microdistrict:${slug}`,
  type: "microdistrict",
  country: "KG",
  canonicalName,
  parentId: "kg:bishkek",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 800,
});

const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 800, parentId = 'kg:bishkek') => Object.freeze({
  id: `kg:bishkek:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId,
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KG_BISHKEK_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict("10-i-mikroraion", "10-й микрорайон", 42.829460195, 74.605767219, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  microdistrict("11-i-mikroraion", "11-й микрорайон", 42.817820295, 74.627780597, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Bishkek"),
  microdistrict("12-i-mikroraion", "12-й микрорайон", 42.812547006, 74.641267536, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  microdistrict("3-i-mikroraion", "3-й микрорайон", 42.835741169, 74.621386619, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Bishkek"),
  microdistrict("7-i-mikroraion", "7-й микрорайон", 42.829443574, 74.622226454, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  microdistrict("8-i-mikroraion", "8-й микрорайон", 42.828064003, 74.608218538, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  microdistrict("alamedin-1", "Аламедин-1", 42.876067081, 74.690612755, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  microdistrict("asanbai", "Асанбай", 42.814040879, 74.630241074, "https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Bishkek"),
  microdistrict("dzhal", "Джал", 42.829775670, 74.564982405, "https://yandex.com/maps/?text=%D0%B6%D0%B8%D0%BB%D0%BE%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%2C%20%D0%91%D0%B8%D1%88%D0%BA%D0%B5%D0%BA"),
  microdistrict("kok-zhar", "Кок-Жар", 42.851433061, 74.634257857, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Bishkek"),
  osmMicrodistrict('6-i-mikroraion', '6-й микрорайон', 42.8242083, 74.6251969, 49145319),
  osmMicrodistrict('dzhal-15', 'Джал-15', 42.8457254, 74.5662172, 156482833, 800, 'kg:bishkek:district:leninsky'),
  osmMicrodistrict('uchkun', 'Учкун', 42.8711202, 74.6936128, 161846744, 800, 'kg:bishkek:district:sverdlovsky'),
  osmMicrodistrict('zhilgorodok-sovmina', 'Жилгородок Совмина', 42.8074809, 74.5899434, 122732980, 800, 'kg:bishkek:district:oktyabrsky'),
]);
