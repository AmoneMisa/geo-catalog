const spatial = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 700) => ({
  id: `uz:samarkand:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const derived = (slug, canonicalName, lat, lng, accuracyM = 1200) => ({
  id: `uz:samarkand:local-area:${slug}`,
  type: 'local_area',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const SAMARKAND_AREA_ENTITIES = Object.freeze([
  spatial('sattepo', 'Sattepo', 'mahalla', 39.63738, 66.91821, 'node', 3379303517, 800),
  spatial('motrid', 'Motrid', 'local_area', 39.68059, 66.96502, 'node', 2406821821, 900),
  spatial('kimyogarlar', 'Kimyogarlar', 'settlement', 39.67138, 66.84918, 'node', 10728273615, 1200),
  spatial('qorasuv', 'Qorasuv', 'local_area', 39.71842, 66.93132, 'way', 742858620, 650),
  derived('siyob', 'Siyob', 39.661893, 66.979915, 900),
  derived('registon', 'Registon', 39.654722, 66.975556, 900),
  derived('center', 'Center', 39.6542, 66.9597, 1600),
  derived('railway-station-area', 'Railway Station area', 39.685888, 66.928915, 1100),
]);
