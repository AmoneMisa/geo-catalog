export { GEO_ENTITIES, getGeoEntity, getGeoEntityByLookupKey, hasGeoEntity, findGeoEntities, getGeoChildren } from './catalog.js';
export { GEO_COVERAGE_GAPS, isGeoCoverageGap } from './coverage-gaps.js';
export { isValidCoordinate, containsPoint, distanceKm, nearestGeoEntity } from './spatial.js';
export { validateGeoCatalog } from './validate.js';
export { geoEntityKey, resolveLexiconGeoEntity, geoIdForLexiconEntity, hasLexiconGeoEntity } from './lexicon-bridge.js';
export { nearestParkToMetro } from './poi-resolvers.js';
export { buildGeoLookupKey } from './lookup-key.js';
