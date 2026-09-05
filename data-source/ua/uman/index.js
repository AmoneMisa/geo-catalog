import { UA_UMAN_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_UMAN_POI_ENTITIES } from './poi.js';

export const UA_UMAN_ENTITIES = Object.freeze([
  ...UA_UMAN_NEIGHBORHOOD_ENTITIES,
  ...UA_UMAN_POI_ENTITIES,
]);
