import { RO_CITY_ENTITIES } from './cities.js';
import { RO_BUCHAREST_ENTITIES } from './bucharest/index.js';

export const RO_ENTITIES = Object.freeze([
  ...RO_CITY_ENTITIES,
  ...RO_BUCHAREST_ENTITIES,
]);
