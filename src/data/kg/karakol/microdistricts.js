const microdistrict = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 500) => Object.freeze({
  id: `kg:karakol:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:karakol',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'neighborhood',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

const mappedMicrodistrict = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 500) => Object.freeze({
  id: `kg:karakol:microdistrict:${slug}`,
  type: 'microdistrict',
  country: 'KG',
  canonicalName,
  parentId: 'kg:karakol',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'neighborhood',
  accuracyM,
});

export const KG_KARAKOL_MICRODISTRICT_ENTITIES = Object.freeze([
  microdistrict('voshod', 'Voshod', 42.50267, 78.39659, 238825748),
  mappedMicrodistrict('kashka-suu', 'Кашка-Суу', 42.467597, 78.397325, 'https://2gis.kg/karakol/geo/70030076874779634'),
  mappedMicrodistrict('khan-tengri', 'Хан-Теңири', 42.46988, 78.382783, 'https://2gis.kg/karakol/geo/70030077147206702'),
]);
