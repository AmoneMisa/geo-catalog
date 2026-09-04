const microdistrict = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `kz:astana:microdistrict:${slug}`,
  type: "microdistrict",
  country: "KZ",
  canonicalName,
  parentId: "kz:astana",
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: "neighborhood",
  accuracyM: 800,
});

export const KZ_ASTANA_NEIGHBORHOOD_ENTITIES = Object.freeze([
  microdistrict("alatau", "Алатау", 51.163201131, 71.452058192, "https://yandex.com/maps/?text=%D0%BC%D0%B8%D0%BA%D1%80%D0%BE%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20Astana"),
]);
