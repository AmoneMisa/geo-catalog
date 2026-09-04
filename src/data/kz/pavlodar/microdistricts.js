const microdistrict = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 900) => Object.freeze({
  id: `kz:pavlodar:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:pavlodar',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM,
});

export const KZ_PAVLODAR_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('dachnyi', 'Дачный', 52.241121, 76.993476, 'https://2gis.kz/pavlodar/geo/15622522632404995', 800),
  microdistrict('saryarka', 'Сарыарка', 52.270713, 76.979189, 'https://2gis.kz/pavlodar/geo/70030076199202426', 1200),
  microdistrict('usolskii', 'Усольский', 52.251959, 76.946900, 'https://2gis.kz/pavlodar/geo/15622522632404996', 900),
]);
