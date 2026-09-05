import { UA_LUTSK_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_LUTSK_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { UA_LUTSK_POI_ENTITIES } from './poi.js';

export const UA_LUTSK_ENTITIES = Object.freeze([
  ...UA_LUTSK_NEIGHBORHOOD_ENTITIES,
  ...UA_LUTSK_RESIDENTIAL_COMPLEX_ENTITIES,
  ...UA_LUTSK_POI_ENTITIES,
]);
