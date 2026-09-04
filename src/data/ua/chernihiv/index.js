import { UA_CHERNIHIV_DISTRICT_ENTITIES } from './districts.js';
import { UA_CHERNIHIV_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_CHERNIHIV_POI_ENTITIES } from './poi.js';

export const UA_CHERNIHIV_ENTITIES = Object.freeze([
  ...UA_CHERNIHIV_DISTRICT_ENTITIES,
  ...UA_CHERNIHIV_NEIGHBORHOOD_ENTITIES,
  ...UA_CHERNIHIV_POI_ENTITIES,
]);
