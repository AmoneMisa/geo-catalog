const osmResidential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 260) => Object.freeze({
  id: `kg:osh:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/${osmType}/${osmId}`,
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

const mappedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 220) => Object.freeze({
  id: `kg:osh:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:osh',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

export const KG_OSH_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  osmResidential('asman-residence-1', 'Asman Residence 1', 40.5051476, 72.8122757, 'way', 1534183059, 320),
  mappedResidential('mon-paris', 'Mon Paris', 40.5152140, 72.8126340, 'https://2gis.kg/osh/directions/points/%7C72.812634%2C40.515214%3B70000001045267673', 180),
  mappedResidential('aristokrat', 'Аристократ', 40.508657, 72.812045, 'https://2gis.kg/osh/geo/70030076301946115'),
  mappedResidential('frunzenskiy', 'Фрунзенский', 40.510586, 72.812026, 'https://2gis.kg/osh/geo/70030076162724974'),
  mappedResidential('million', 'Миллион', 40.52015, 72.771354, 'https://2gis.kg/osh/geo/70030076181344221'),
  mappedResidential('osh-plaza', 'Osh Plaza', 40.519776, 72.764026, 'https://2gis.kg/osh/geo/70030076178106403'),
  mappedResidential('sere', 'Сере', 40.53838, 72.803199, 'https://2gis.kg/osh/geo/70030076168033038'),
  osmResidential('ak-bata', 'Ак-Бата', 40.5690488, 72.7983314, 'way', 1359814538),
  osmResidential('ak-bata-2', 'Ак-Бата 2', 40.5704667, 72.7982592, 'way', 1359814550),
  osmResidential('manas', 'Манас', 40.5700488, 72.8001436, 'way', 1359814541),
  mappedResidential('sulayman-too', 'ЖК Сулайман Тоо', 40.519081, 72.800382, 'https://2gis.kg/osh/geo/70030076192613424'),
  mappedResidential('taberik', 'Таберик', 40.508414, 72.812619, 'https://2gis.kg/osh/geo/70030076155803515'),
  mappedResidential('yudzhin', 'Юджин', 40.534652, 72.801428, 'https://2gis.kg/osh/geo/70030076158011871'),
]);
