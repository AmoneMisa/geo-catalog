import { UA_BERDYCHIV_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_BERDYCHIV_STREET_ENTITIES } from './streets.js';
import { UA_BERDYCHIV_POI_ENTITIES } from './poi.js';

export const UA_BERDYCHIV_ENTITIES = Object.freeze([
  ...UA_BERDYCHIV_NEIGHBORHOOD_ENTITIES,
  ...UA_BERDYCHIV_STREET_ENTITIES,
  ...UA_BERDYCHIV_POI_ENTITIES,
]);
