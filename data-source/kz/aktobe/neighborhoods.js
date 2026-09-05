const microdistrict = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:aktobe:microdistrict:${slug}`,
  type: "microdistrict",
  country: "KZ",
  canonicalName,
  parentId: "kz:aktobe",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 800,
});

const osmMicrodistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 800) => Object.freeze({
  id: `kz:aktobe:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:aktobe',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

export const KZ_AKTOBE_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict("11-i-mikroraion", "11-й микрорайон", 50.280403386, 57.195362686, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20%D0%90%D2%9B%D1%82%D3%A9%D0%B1%D0%B5"),
  microdistrict("12-i-mikroraion", "12-й микрорайон", 50.279757383, 57.195706160, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  microdistrict("4-i-mikroraion", "4-й микрорайон", 50.320885308, 57.371442647, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Aktobe"),
  microdistrict("5-i-mikroraion", "5-й микрорайон", 50.293407630, 57.172574175, "https://yandex.com/maps/?text=%D1%82%D2%B1%D1%80%D2%93%D1%8B%D0%BD%20%D2%AF%D0%B9%20%D0%BA%D0%B5%D1%88%D0%B5%D0%BD%D1%96%2C%20Aktobe"),
  microdistrict("1-i-mikroraion", "1-й микрорайон", 50.3164706, 57.3321526, "https://www.openstreetmap.org/way/1198573196"),
  microdistrict("3-i-mikroraion", "3-й микрорайон", 50.3263874, 57.3555572, "https://www.openstreetmap.org/way/1163647265"),
  microdistrict("8-i-mikroraion", "8-й микрорайон", 50.2847988, 57.1589005, "https://www.openstreetmap.org/way/456304330"),
  osmMicrodistrict('2-i-mikroraion', '2-й микрорайон', 50.3199485, 57.3395686, 1198573197),
]);
