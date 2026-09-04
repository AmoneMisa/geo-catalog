import { KZ_ALMATY_DISTRICT_ENTITIES } from './districts.js';
import { KZ_ALMATY_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { KZ_ALMATY_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { KZ_ALMATY_STREET_ENTITIES } from './streets.js';
import { KZ_ALMATY_POI_ENTITIES } from './poi.js';

export const KZ_ALMATY_ENTITIES = Object.freeze([
  ...KZ_ALMATY_DISTRICT_ENTITIES,
  ...KZ_ALMATY_NEIGHBORHOOD_ENTITIES,
  ...KZ_ALMATY_RESIDENTIAL_COMPLEX_ENTITIES,
  ...KZ_ALMATY_STREET_ENTITIES,
  ...KZ_ALMATY_POI_ENTITIES,
]);
