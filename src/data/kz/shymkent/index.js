import { KZ_SHYMKENT_DISTRICT_ENTITIES } from './districts.js';
import { KZ_SHYMKENT_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { KZ_SHYMKENT_POI_ENTITIES } from './poi.js';

export const KZ_SHYMKENT_ENTITIES = Object.freeze([
  ...KZ_SHYMKENT_DISTRICT_ENTITIES,
  ...KZ_SHYMKENT_NEIGHBORHOOD_ENTITIES,
  ...KZ_SHYMKENT_POI_ENTITIES,
]);
