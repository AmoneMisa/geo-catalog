import { KZ_CITY_ENTITIES } from './cities.js';
import { KZ_ALMATY_ENTITIES } from './almaty/index.js';
import { KZ_ASTANA_ENTITIES } from './astana/index.js';
import { KZ_SHYMKENT_ENTITIES } from './shymkent/index.js';
import { KZ_AKTOBE_ENTITIES } from './aktobe/index.js';
import { KZ_AKTAU_ENTITIES } from './aktau/index.js';
import { KZ_KARAGANDA_ENTITIES } from './karaganda/index.js';
import { KZ_TARAZ_ENTITIES } from './taraz/index.js';
import { KZ_KOSTANAY_ENTITIES } from './kostanay/index.js';
import { KZ_PAVLODAR_ENTITIES } from './pavlodar/index.js';
import { KZ_OSKEMEN_ENTITIES } from './oskemen/index.js';

export const KZ_ENTITIES = Object.freeze([
  ...KZ_CITY_ENTITIES,
  ...KZ_ALMATY_ENTITIES,
  ...KZ_ASTANA_ENTITIES,
  ...KZ_SHYMKENT_ENTITIES,
  ...KZ_AKTOBE_ENTITIES,
  ...KZ_AKTAU_ENTITIES,
  ...KZ_KARAGANDA_ENTITIES,
  ...KZ_TARAZ_ENTITIES,
  ...KZ_KOSTANAY_ENTITIES,
  ...KZ_PAVLODAR_ENTITIES,
  ...KZ_OSKEMEN_ENTITIES,
]);
