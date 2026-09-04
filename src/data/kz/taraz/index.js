import { KZ_TARAZ_DISTRICT_ENTITIES } from './districts.js';
import { KZ_TARAZ_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { KZ_TARAZ_POI_ENTITIES } from './poi.js';
import { KZ_TARAZ_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { KZ_TARAZ_STREET_ENTITIES } from './streets.js';

export const KZ_TARAZ_ENTITIES = Object.freeze([
  ...KZ_TARAZ_DISTRICT_ENTITIES,
  ...KZ_TARAZ_NEIGHBORHOOD_ENTITIES,
  ...KZ_TARAZ_RESIDENTIAL_COMPLEX_ENTITIES,
  ...KZ_TARAZ_POI_ENTITIES,
  ...KZ_TARAZ_STREET_ENTITIES,
]);
