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

export const SAMARKAND_AREA_ENTITIES = Object.freeze([
  // Preserve the mapped/source canonical Sattepo on the physical owner.
  // Sartepa and Sat-Tepo listing spellings resolve to this stable owner in the bridge.
  spatial('sattepo', 'Sattepo', 'mahalla', 39.63738, 66.91821, 'node', 3379303517, 800),
  spatial('motrid', 'Motrid', 'local_area', 39.68059, 66.96502, 'node', 2406821821, 900),
  spatial('kimyogarlar', 'Kimyogarlar', 'settlement', 39.67138, 66.84918, 'node', 10728273615, 1200),
  spatial('qorasuv', 'Qorasuv', 'local_area', 39.71842, 66.93132, 'way', 742858620, 650),
  spatial('sogdiana', 'Sogdiana', 'mahalla', 39.647951, 66.960270, 'node', 11985323303, 700),
  spatial('bogishamol', 'Bogishamol', 'local_area', 39.667063, 66.931975, 'way', 167293777, 900),
]);
