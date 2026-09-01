// Chernivtsi has no current administrative district layer.
// The city district division was abolished effective 2016-01-01 by Chernivtsi City Council
// decision No. 1542 of 2015-03-26. CEC resolution No. 870 of 2019-04-30 confirms the
// cancellation and liquidation of the former Pershotravnevyi, Sadhirskyi and Shevchenkivskyi
// districts: https://zakon.rada.gov.ua/laws/show/v0870359-19

import { UA_CHERNIVTSI_NEIGHBORHOOD_ENTITIES } from './neighborhoods.js';
import { UA_CHERNIVTSI_POI_ENTITIES } from './poi.js';
import { UA_CHERNIVTSI_RESIDENTIAL_COMPLEX_ENTITIES } from './residential-complexes.js';

export const UA_CHERNIVTSI_ENTITIES = Object.freeze([
  ...UA_CHERNIVTSI_NEIGHBORHOOD_ENTITIES,
  ...UA_CHERNIVTSI_POI_ENTITIES,
  ...UA_CHERNIVTSI_RESIDENTIAL_COMPLEX_ENTITIES,
]);
