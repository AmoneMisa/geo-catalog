import { KZ_AKTOBE_DISTRICT_ENTITIES } from './districts.js';
import { KZ_AKTOBE_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { KZ_AKTOBE_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { KZ_AKTOBE_STREET_ENTITIES } from './streets.js';

export const KZ_AKTOBE_ENTITIES = Object.freeze([
  ...KZ_AKTOBE_DISTRICT_ENTITIES,
  ...KZ_AKTOBE_NEIGHBORHOOD_ENTITIES,
  ...KZ_AKTOBE_RESIDENTIAL_COMPLEX_ENTITIES,
  ...KZ_AKTOBE_STREET_ENTITIES,
]);
