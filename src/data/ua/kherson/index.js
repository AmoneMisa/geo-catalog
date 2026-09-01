import { UA_KHERSON_DISTRICT_ENTITIES } from './districts.js';
import { UA_KHERSON_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_KHERSON_POI_ENTITIES } from './poi.js';

export const UA_KHERSON_ENTITIES = Object.freeze([
  ...UA_KHERSON_DISTRICT_ENTITIES,
  ...UA_KHERSON_NEIGHBORHOOD_ENTITIES,
  ...UA_KHERSON_POI_ENTITIES,
]);