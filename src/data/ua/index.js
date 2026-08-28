import { UA_CITY_ENTITIES } from './cities.js';
import { UA_SECONDARY_CITY_ANCHORS } from './secondary-city-anchors.js';
import { UA_KYIV_ENTITIES } from './kyiv/index.js';
import { UA_ODESA_ENTITIES } from './odesa/index.js';
import { UA_CHERNIVTSI_ENTITIES } from './chernivtsi/index.js';
import { UA_KHMELNYTSKYI_ENTITIES } from './khmelnytskyi/index.js';
import { UA_SUMY_ENTITIES } from './sumy/index.js';
import { UA_KROPYVNYTSKYI_ENTITIES } from './kropyvnytskyi/index.js';
import { UA_KREMENCHUK_ENTITIES } from './kremenchuk/index.js';
import { UA_BILA_TSERKVA_ENTITIES } from './bila-tserkva/index.js';
import { UA_RIVNE_ENTITIES } from './rivne/index.js';
import { UA_KHERSON_ENTITIES } from './kherson/index.js';
import { UA_VINNYTSIA_ENTITIES } from './vinnytsia/index.js';
import { UA_MYKOLAIV_ENTITIES } from './mykolaiv/index.js';
import { UA_CHERKASY_ENTITIES } from './cherkasy/index.js';

export const UA_ENTITIES = Object.freeze([
  ...UA_CITY_ENTITIES,
  ...UA_SECONDARY_CITY_ANCHORS,
  ...UA_KYIV_ENTITIES,
  ...UA_ODESA_ENTITIES,
  ...UA_CHERNIVTSI_ENTITIES,
  ...UA_KHMELNYTSKYI_ENTITIES,
  ...UA_SUMY_ENTITIES,
  ...UA_KROPYVNYTSKYI_ENTITIES,
  ...UA_KREMENCHUK_ENTITIES,
  ...UA_BILA_TSERKVA_ENTITIES,
  ...UA_RIVNE_ENTITIES,
  ...UA_KHERSON_ENTITIES,
  ...UA_VINNYTSIA_ENTITIES,
  ...UA_MYKOLAIV_ENTITIES,
  ...UA_CHERKASY_ENTITIES,
]);
