export { GEO_ENTITIES, getGeoEntity, getGeoEntityByLookupKey, hasGeoEntity, findGeoEntities, getGeoChildren } from './catalog.js';
export { GEO_COVERAGE_GAPS, isGeoCoverageGap } from './coverage-gaps.js';
export { isValidCoordinate, containsPoint, distanceKm, nearestGeoEntity } from './spatial.js';
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
export {
  TRANSPORT_STOPS,
  TRANSPORT_ROUTES,
  TRANSPORT_TRANSFERS,
  getTransportStop,
  getTransportRoute,
  findTransportStops,
  findTransportRoutes,
  getRoutesForStop,
  getStopsForRoute,
  getTransfersForStop,
  validateTransportCatalog,
} from './transport/catalog.js';
