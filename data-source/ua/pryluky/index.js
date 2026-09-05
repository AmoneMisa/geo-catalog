import { UA_PRYLUKY_POI_ENTITIES } from './poi.js';

const UA_PRYLUKY_CITY = Object.freeze({
  id: 'ua:pryluky',
  type: 'city',
  country: 'UA',
  canonicalName: 'Pryluky',
  center: Object.freeze({ lat: 50.5951, lng: 32.3867 }),
  source: 'osm',
  accuracy: 'city',
  accuracyM: 3000,
  osm: Object.freeze({ type: 'node', id: 1105432954 }),
  wikidataId: 'Q1000404',
  sourceUrl: 'https://www.openstreetmap.org/node/1105432954',
});

export const UA_PRYLUKY_ENTITIES = Object.freeze([
  UA_PRYLUKY_CITY,
  ...UA_PRYLUKY_POI_ENTITIES,
]);
