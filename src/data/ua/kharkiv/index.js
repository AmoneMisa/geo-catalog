import { UA_KHARKIV_POI_ENTITIES } from './poi.js';
import { UA_KHARKIV_DISTRICT_ENTITIES } from './districts.js';
import { UA_KHARKIV_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';

export const UA_KHARKIV_ENTITIES = Object.freeze([
  ...UA_KHARKIV_DISTRICT_ENTITIES,
  ...UA_KHARKIV_NEIGHBORHOOD_ENTITIES,
  ...UA_KHARKIV_POI_ENTITIES,
]);
