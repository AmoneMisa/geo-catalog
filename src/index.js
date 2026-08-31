export { GEO_ENTITIES, getGeoEntity, getGeoEntityByLookupKey, hasGeoEntity, findGeoEntities, getGeoChildren, getGeoDescendants } from './catalog.js';
export { GEO_COVERAGE_GAPS, isGeoCoverageGap } from './coverage-gaps.js';
export { isValidCoordinate, containsPoint, distanceKm, convexHullPositions, nearestGeoEntity } from './spatial.js';
export { validateGeoCatalog } from './validate.js';
export { geoEntityKey, resolveLexiconGeoEntity, geoIdForLexiconEntity, hasLexiconGeoEntity } from './lexicon-bridge.js';
export {
  nearestGeoEntityToMetro,
  nearestMetroToGeoEntity,
  nearestMetroToPoint,
  nearestParkToMetro,
  nearestMetroToPark,
  nearestPoiToMetro,
  nearestMetroToPoi,
  nearestMahallaToMetro,
  nearestMetroToMahalla,
  nearestMicrodistrictToMetro,
  nearestMetroToMicrodistrict,
  nearestLocalAreaToMetro,
  nearestMetroToLocalArea,
  nearestAddressToMetro,
  nearestMetroToAddress,
} from './poi-resolvers.js';
export { buildGeoLookupKey } from './lookup-key.js';
