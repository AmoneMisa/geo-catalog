import { UA_RIVNE_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_RIVNE_POI_ENTITIES } from './poi.js';
import { UA_RIVNE_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';

export const UA_RIVNE_ENTITIES = Object.freeze([
  ...UA_RIVNE_NEIGHBORHOOD_ENTITIES,
  ...UA_RIVNE_POI_ENTITIES,
  ...UA_RIVNE_RESIDENTIAL_COMPLEX_ENTITIES,
]);
