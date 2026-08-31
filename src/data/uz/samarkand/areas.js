const spatial = (slug, canonicalName, type, lat, lng, osmType, osmId, accuracyM = 700, parentId = 'uz:samarkand') => ({
  id: `uz:samarkand:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'neighborhood',
  accuracyM,
  osm: { type: osmType, id: osmId },
});

const mappedSpatial = (slug, canonicalName, type, lat, lng, accuracyM, sourceUrl, parentId = 'uz:samarkand') => ({
  id: `uz:samarkand:${type.replace('_', '-')}:${slug}`,
  type,
  country: 'UZ',
  canonicalName,
  parentId,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'neighborhood',
  accuracyM,
  sourceUrl,
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
  // Current city sources call this So'lim shaharchasi, while mapped/populated-place
  // sources retain the historical Xishrov/Khishrav name. Keep the physical source
  // canonical here; parser-facing current names belong in the lexicon bridge.
  mappedSpatial('xishrov', 'Xishrov', 'settlement', 39.636575, 66.888533, 1700, 'https://maps.visicom.ua/i/STL1Q0Q3G'),
  mappedSpatial('navroz', "Navro'z", 'mahalla', 39.639237, 66.852219, 1000, 'https://yandex.uz/maps/10334/samarkand/geo/6106237055/', 'uz:samarkand:settlement:xishrov'),
  // Official city geography lists Farhod as a shaharcha within Samarkand; Yandex
  // exposes a standalone settlement geo-object. Keep the owner broad enough for
  // settlement-level use and do not reuse it as a center for its child mahallas.
  mappedSpatial('farhod', 'Farhod', 'settlement', 39.694333, 67.060835, 1600, 'https://yandex.uz/maps/geo/farhod_shaharchasi/1508545242/'),
  // Official city statistics and 2GIS identify Chilquduq as a standalone MFY.
  // Yandex maps Samarqand Street inside that MFY; use its mapped center only as
  // a broad neighborhood anchor, not as a claimed cadastral centroid.
  mappedSpatial('chilquduq', 'Chilquduq', 'mahalla', 39.635549, 66.889913, 1800, 'https://yandex.com/maps/105810/samarqand-province/geo/4606273793/', 'uz:samarkand:settlement:xishrov'),
]);
