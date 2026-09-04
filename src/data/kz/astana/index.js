import { KZ_ASTANA_DISTRICT_ENTITIES } from './districts.js';
import { KZ_ASTANA_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { KZ_ASTANA_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';
import { KZ_ASTANA_STREET_ENTITIES } from './streets.js';

export const KZ_ASTANA_ENTITIES = Object.freeze([
  ...KZ_ASTANA_DISTRICT_ENTITIES,
  ...KZ_ASTANA_NEIGHBORHOOD_ENTITIES,
  ...KZ_ASTANA_RESIDENTIAL_COMPLEX_ENTITIES,
  ...KZ_ASTANA_STREET_ENTITIES,
]);
