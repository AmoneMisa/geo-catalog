import { KZ_CITY_ENTITIES } from './cities.js';
import { KZ_ALMATY_ENTITIES } from './almaty/index.js';
import { KZ_ASTANA_ENTITIES } from './astana/index.js';

export const KZ_ENTITIES = Object.freeze([
  ...KZ_CITY_ENTITIES,
  ...KZ_ALMATY_ENTITIES,
  ...KZ_ASTANA_ENTITIES,
]);
