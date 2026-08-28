import { UA_SUMY_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_SUMY_POI_ENTITIES } from './poi.js';

export const UA_SUMY_ENTITIES = Object.freeze([
  ...UA_SUMY_NEIGHBORHOOD_ENTITIES,
  ...UA_SUMY_POI_ENTITIES,
]);
