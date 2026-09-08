export { GEO_ENTITIES, getGeoEntity, getGeoEntityByLookupKey, hasGeoEntity, findGeoEntities, findGeoEntitiesByName, getGeoChildren, getGeoDescendants } from './catalog.js';
export { GEO_COVERAGE_GAPS, isGeoCoverageGap } from './coverage-gaps.js';
export { isValidCoordinate, containsPoint, distanceKm, convexHullPositions, nearestGeoEntity } from './spatial.js';
export { validateGeoCatalog } from './validate.js';
export { GEO_POI_CATEGORIES, GEO_POI_SUBTYPES, geoPoiCategory } from './poi-taxonomy.js';
export { extractOsmPoiCandidates, mergeOsmPoiCandidates, osmPoiCategory } from './osm-poi-import.js';
export { resolveGeoCatalogCandidates } from './candidate-resolver.js';
export { geoEntityKey, resolveLexiconGeoEntity, geoIdForLexiconEntity, hasLexiconGeoEntity } from './lexicon-runtime-bridge.js';
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
