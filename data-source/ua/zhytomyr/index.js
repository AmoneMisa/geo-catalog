import { UA_ZHYTOMYR_DISTRICT_ENTITIES } from './districts.js';
import { UA_ZHYTOMYR_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_ZHYTOMYR_POI_ENTITIES } from './poi.js';

export const UA_ZHYTOMYR_ENTITIES = Object.freeze([
  ...UA_ZHYTOMYR_DISTRICT_ENTITIES,
  ...UA_ZHYTOMYR_NEIGHBORHOOD_ENTITIES,
  ...UA_ZHYTOMYR_POI_ENTITIES,
]);
