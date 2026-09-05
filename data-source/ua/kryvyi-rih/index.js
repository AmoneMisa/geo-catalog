import { UA_KRYVYI_RIH_DISTRICT_ENTITIES } from './districts.js';
import { UA_KRYVYI_RIH_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_KRYVYI_RIH_POI_ENTITIES } from './poi.js';

export const UA_KRYVYI_RIH_ENTITIES = Object.freeze([
  ...UA_KRYVYI_RIH_DISTRICT_ENTITIES,
  ...UA_KRYVYI_RIH_NEIGHBORHOOD_ENTITIES,
  ...UA_KRYVYI_RIH_POI_ENTITIES,
]);
