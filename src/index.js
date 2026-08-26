export { GEO_ENTITIES, getGeoEntity, hasGeoEntity, findGeoEntities, getGeoChildren } from './catalog.js';
export { GEO_COVERAGE_GAPS, isGeoCoverageGap } from './coverage-gaps.js';
export { isValidCoordinate, containsPoint, distanceKm, nearestGeoEntity } from './spatial.js';
export { validateGeoCatalog } from './validate.js';
export { geoEntityKey, resolveLexiconGeoEntity, geoIdForLexiconEntity, hasLexiconGeoEntity } from './lexicon-bridge.js';
