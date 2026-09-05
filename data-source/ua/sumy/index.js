import { UA_SUMY_DISTRICT_ENTITIES } from './districts.js';
import { UA_SUMY_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_SUMY_POI_ENTITIES } from './poi.js';
import { UA_SUMY_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';

export const UA_SUMY_ENTITIES = Object.freeze([
  ...UA_SUMY_DISTRICT_ENTITIES,
  ...UA_SUMY_NEIGHBORHOOD_ENTITIES,
  ...UA_SUMY_POI_ENTITIES,
  ...UA_SUMY_RESIDENTIAL_COMPLEX_ENTITIES,
]);
