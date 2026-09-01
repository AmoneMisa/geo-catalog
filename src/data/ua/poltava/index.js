import { UA_POLTAVA_DISTRICT_ENTITIES } from './districts.js';
import { UA_POLTAVA_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_POLTAVA_POI_ENTITIES } from './poi.js';

export const UA_POLTAVA_ENTITIES = Object.freeze([
  ...UA_POLTAVA_DISTRICT_ENTITIES,
  ...UA_POLTAVA_NEIGHBORHOOD_ENTITIES,
  ...UA_POLTAVA_POI_ENTITIES,
]);