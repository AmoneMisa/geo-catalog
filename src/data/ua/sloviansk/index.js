import { UA_SLOVIANSK_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_SLOVIANSK_SUBURB_ENTITIES } from './suburbs.js';
import { UA_SLOVIANSK_POI_ENTITIES } from './poi.js';

export const UA_SLOVIANSK_ENTITIES = Object.freeze([
  ...UA_SLOVIANSK_NEIGHBORHOOD_ENTITIES,
  ...UA_SLOVIANSK_SUBURB_ENTITIES,
  ...UA_SLOVIANSK_POI_ENTITIES,
]);
