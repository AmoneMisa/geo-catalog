import {
  TASHKENT_METRO_ROUTES,
  TASHKENT_METRO_STOPS,
  TASHKENT_METRO_TRANSFERS,
} from './tashkent-metro.js';
import {
  TASHKENT_BUS_ROUTES,
  TASHKENT_BUS_STOPS,
  TASHKENT_BUS_ROUTE_VARIANTS,
} from './tashkent-bus-catalog.js';

export const TRANSPORT_STOPS = Object.freeze([
  ...TASHKENT_METRO_STOPS,
  ...TASHKENT_BUS_STOPS,
]);

export const TRANSPORT_ROUTES = Object.freeze([
  ...TASHKENT_METRO_ROUTES,
  ...TASHKENT_BUS_ROUTES,
]);

export const TRANSPORT_ROUTE_VARIANTS = Object.freeze([
  ...TASHKENT_BUS_ROUTE_VARIANTS,
]);

export const TRANSPORT_TRANSFERS = Object.freeze([
  ...TASHKENT_METRO_TRANSFERS,
]);

const stopsById = new Map(TRANSPORT_STOPS.map((stop) => [stop.id, stop]));
const routesById = new Map(TRANSPORT_ROUTES.map((route) => [route.id, route]));
const variantsById = new Map(TRANSPORT_ROUTE_VARIANTS.map((variant) => [variant.id, variant]));

const EARTH_RADIUS_M = 6_371_000;
const toRadians = (degrees) => (degrees * Math.PI) / 180;

function isValidCoordinate(center) {
  return center &&
    Number.isFinite(center.lat) &&
    Number.isFinite(center.lng) &&
    center.lat >= -90 && center.lat <= 90 &&
    center.lng >= -180 && center.lng <= 180;
}

function isValidBounds(bounds) {
  if (!bounds) return false;
  const { west, south, east, north } = bounds;
  return [west, south, east, north].every(Number.isFinite) &&
    west >= -180 && east <= 180 && south >= -90 && north <= 90 &&
    west <= east && south <= north;
}

const pointInsideBounds = (point, bounds) =>
  point.lng >= bounds.west && point.lng <= bounds.east &&
  point.lat >= bounds.south && point.lat <= bounds.north;

const boundsIntersect = (a, b) =>
  a.west <= b.east && a.east >= b.west &&
  a.south <= b.north && a.north >= b.south;

const geometryOwnerIntersectsBounds = (owner, bounds) =>
  !bounds || (isValidBounds(owner?.bounds) && boundsIntersect(owner.bounds, bounds));

const routeHasGeometry = (route) =>
  Boolean(route.geometry) || (route.variants?.some((variant) => Boolean(variant.geometry)) ?? false);

const routeIntersectsBounds = (route, bounds) => {
  if (!bounds) return true;
  if (geometryOwnerIntersectsBounds(route, bounds)) return true;
  return route.variants?.some((variant) => geometryOwnerIntersectsBounds(variant, bounds)) ?? false;
};

export function transportDistanceM(a, b) {
  if (!isValidCoordinate(a) || !isValidCoordinate(b)) return Number.POSITIVE_INFINITY;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function getTransportStop(id) {
  return stopsById.get(String(id || '')) ?? null;
}

export function getTransportRoute(id) {
  return routesById.get(String(id || '')) ?? null;
}

export function getTransportRouteVariant(id) {
  return variantsById.get(String(id || '')) ?? null;
}

export function findTransportStops(filters = {}) {
  const { country, cityId, mode, bounds } = filters;
  if (bounds != null && !isValidBounds(bounds)) return [];
  return TRANSPORT_STOPS.filter((stop) =>
    (!country || stop.country === country) &&
    (!cityId || stop.cityId === cityId) &&
    (!mode || stop.mode === mode) &&
    (!bounds || pointInsideBounds(stop.center, bounds))
  );
}

export function findTransportRoutes(filters = {}) {
  const { country, cityId, mode, ref, coverage, bounds } = filters;
  if (bounds != null && !isValidBounds(bounds)) return [];
  return TRANSPORT_ROUTES.filter((route) =>
    (!country || route.country === country) &&
    (!cityId || route.cityId === cityId) &&
    (!mode || route.mode === mode) &&
    (!ref || route.ref === ref) &&
    (!coverage || route.coverage === coverage) &&
    routeIntersectsBounds(route, bounds)
  );
}

export function findTransportRouteVariants(filters = {}) {
  const { country, cityId, mode, ref, bounds, hasGeometry } = filters;
  if (bounds != null && !isValidBounds(bounds)) return [];
  return TRANSPORT_ROUTE_VARIANTS.filter((variant) =>
    (!country || variant.country === country) &&
    (!cityId || variant.cityId === cityId) &&
    (!mode || variant.mode === mode) &&
    (!ref || variant.ref === ref) &&
    (hasGeometry == null || Boolean(variant.geometry) === Boolean(hasGeometry)) &&
    geometryOwnerIntersectsBounds(variant, bounds)
  );
}

const routeContainsStop = (route, stopId) =>
  route.stopIds.includes(stopId) || route.variants?.some((variant) => variant.stopIds.includes(stopId));

export function getRoutesForStop(stopId, options = {}) {
  const id = String(stopId || '');
  const { requireFullSequence = false } = options;
  return TRANSPORT_ROUTES.filter((route) =>
    routeContainsStop(route, id) && (!requireFullSequence || route.coverage === 'full')
  );
}

export function nearestTransportStops(point, options = {}) {
  if (!isValidCoordinate(point)) return [];
  const {
    country,
    cityId,
    mode,
    maxDistanceM = 1500,
    limit = Number.POSITIVE_INFINITY,
    includeRoutes = true,
  } = options;
  const maxDistance = Number(maxDistanceM);
  const maxItems = Number(limit);
  if (!Number.isFinite(maxDistance) || maxDistance < 0) return [];

  return findTransportStops({ country, cityId, mode })
    .map((stop) => ({ stop, distanceM: transportDistanceM(point, stop.center) }))
    .filter((item) => item.distanceM <= maxDistance)
    .sort((a, b) => a.distanceM - b.distanceM || a.stop.id.localeCompare(b.stop.id))
    .slice(0, Number.isFinite(maxItems) && maxItems >= 0 ? Math.floor(maxItems) : undefined)
    .map(({ stop, distanceM }) => Object.freeze({
      stop,
      distanceM: Math.round(distanceM),
      routeRefs: Object.freeze(
        includeRoutes
          ? [...new Set(getRoutesForStop(stop.id).map((route) => route.ref).filter(Boolean))]
          : [],
      ),
    }));
}

export function getStopsForRoute(routeId) {
  const route = getTransportRoute(routeId);
  if (!route) return [];
  return route.stopIds.map((id) => stopsById.get(id)).filter(Boolean);
}

export function getRouteVariants(routeId) {
  return getTransportRoute(routeId)?.variants ?? [];
}

export function getStopsForRouteVariant(routeId, variantId) {
  const route = getTransportRoute(routeId);
  if (!route?.variants?.length) return [];
  const id = String(variantId || '');
  const numericId = Number(variantId);
  const variant = route.variants.find((candidate) =>
    candidate.id === id || (Number.isFinite(numericId) && candidate.osm?.id === numericId)
  );
  if (!variant) return [];
  return variant.stopIds.map((stopId) => stopsById.get(stopId)).filter(Boolean);
}

export function getTransfersForStop(stopId) {
  const id = String(stopId || '');
  return TRANSPORT_TRANSFERS.filter((transfer) => transfer.stopIds.includes(id));
}

export function getTransportCoverage(filters = {}) {
  const routes = findTransportRoutes(filters);
  const byCoverage = { full: 0, terminals_only: 0, metadata_only: 0 };
  for (const route of routes) byCoverage[route.coverage] += 1;
  return Object.freeze({
    total: routes.length,
    full: byCoverage.full,
    terminalsOnly: byCoverage.terminals_only,
    metadataOnly: byCoverage.metadata_only,
  });
}

export function getTransportMapCoverage(filters = {}) {
  const { bounds: _ignoredBounds, ...routeFilters } = filters;
  const routes = findTransportRoutes(routeFilters);
  const withGeometry = routes.filter(routeHasGeometry).length;
  const refs = new Set(routes.map((route) => route.ref).filter(Boolean));
  const variantsWithGeometry = TRANSPORT_ROUTE_VARIANTS.filter((variant) =>
    (!routeFilters.country || variant.country === routeFilters.country) &&
    (!routeFilters.cityId || variant.cityId === routeFilters.cityId) &&
    (!routeFilters.mode || variant.mode === routeFilters.mode) &&
    (!routeFilters.ref || variant.ref === routeFilters.ref) &&
    refs.has(variant.ref) &&
    Boolean(variant.geometry)
  ).length;

  return Object.freeze({
    total: routes.length,
    withGeometry,
    withoutGeometry: routes.length - withGeometry,
    variantsWithGeometry,
  });
}

const emptyFeatureCollection = () => Object.freeze({
  type: 'FeatureCollection',
  features: Object.freeze([]),
});

const routeGeometryFeature = (route, variant = null) => {
  const owner = variant ?? route;
  if (!owner.geometry) return null;
  return Object.freeze({
    type: 'Feature',
    id: owner.id,
    geometry: owner.geometry,
    properties: Object.freeze({
      id: owner.id,
      routeId: route.id,
      mode: route.mode,
      ref: route.ref ?? null,
      canonicalName: owner.canonicalName,
      variantIndex: variant?.variantIndex ?? null,
      from: variant?.from ?? null,
      to: variant?.to ?? null,
      osmRelationId: owner.osm?.type === 'relation' ? owner.osm.id : null,
    }),
  });
};

export function getTransportRouteGeoJSON(routeId, options = {}) {
  const route = getTransportRoute(routeId);
  if (!route) return emptyFeatureCollection();
  const { bounds } = options;
  if (bounds != null && !isValidBounds(bounds)) return emptyFeatureCollection();

  const features = [];
  if (geometryOwnerIntersectsBounds(route, bounds)) {
    const routeFeature = routeGeometryFeature(route);
    if (routeFeature) features.push(routeFeature);
  }
  for (const variant of route.variants ?? []) {
    if (!geometryOwnerIntersectsBounds(variant, bounds)) continue;
    const feature = routeGeometryFeature(route, variant);
    if (feature) features.push(feature);
  }

  return Object.freeze({
    type: 'FeatureCollection',
    features: Object.freeze(features),
  });
}

export function getTransportRoutesGeoJSON(filters = {}) {
  const { bounds } = filters;
  if (bounds != null && !isValidBounds(bounds)) return emptyFeatureCollection();

  const features = [];
  for (const route of findTransportRoutes(filters)) {
    if (geometryOwnerIntersectsBounds(route, bounds)) {
      const routeFeature = routeGeometryFeature(route);
      if (routeFeature) features.push(routeFeature);
    }
    for (const variant of route.variants ?? []) {
      if (!geometryOwnerIntersectsBounds(variant, bounds)) continue;
      const feature = routeGeometryFeature(route, variant);
      if (feature) features.push(feature);
    }
  }

  return Object.freeze({
    type: 'FeatureCollection',
    features: Object.freeze(features),
  });
}

export function getTransportStopsGeoJSON(filters = {}) {
  return Object.freeze({
    type: 'FeatureCollection',
    features: Object.freeze(findTransportStops(filters).map((stop) => Object.freeze({
      type: 'Feature',
      id: stop.id,
      geometry: Object.freeze({
        type: 'Point',
        coordinates: Object.freeze([stop.center.lng, stop.center.lat]),
      }),
      properties: Object.freeze({
        id: stop.id,
        canonicalName: stop.canonicalName,
        mode: stop.mode,
        geoEntityId: stop.geoEntityId ?? null,
        osmType: stop.osm?.type ?? null,
        osmId: stop.osm?.id ?? null,
      }),
    }))),
  });
}

const isValidLngLat = (position) =>
  Array.isArray(position) &&
  position.length >= 2 &&
  Number.isFinite(position[0]) &&
  Number.isFinite(position[1]) &&
  position[0] >= -180 && position[0] <= 180 &&
  position[1] >= -90 && position[1] <= 90;

function validateRouteGeometry(owner, errors) {
  if (!owner?.geometry && !owner?.bounds) return;
  if (!owner?.geometry) {
    errors.push(`Transport geometry owner ${owner?.id || '<unknown>'} has bounds without geometry.`);
    return;
  }
  if (owner.geometry.type !== 'MultiLineString' || !Array.isArray(owner.geometry.coordinates) || !owner.geometry.coordinates.length) {
    errors.push(`Transport geometry owner ${owner?.id || '<unknown>'} must contain a non-empty MultiLineString.`);
    return;
  }

  for (const segment of owner.geometry.coordinates) {
    if (!Array.isArray(segment) || segment.length < 2 || segment.some((position) => !isValidLngLat(position))) {
      errors.push(`Transport geometry owner ${owner.id} contains an invalid line segment.`);
      break;
    }
  }

  if (owner.bounds && !isValidBounds(owner.bounds)) {
    errors.push(`Transport geometry owner ${owner.id} has invalid bounds.`);
  }
}

export function validateTransportCatalog({
  stops = TRANSPORT_STOPS,
  routes = TRANSPORT_ROUTES,
  transfers = TRANSPORT_TRANSFERS,
} = {}) {
  const errors = [];
  const stopIds = new Set();
  const routeIds = new Set();
  const variantIds = new Set();

  for (const stop of stops) {
    if (!stop?.id) errors.push('Transport stop is missing id.');
    else if (stopIds.has(stop.id)) errors.push(`Duplicate transport stop id: ${stop.id}`);
    else stopIds.add(stop.id);

    if (!isValidCoordinate(stop?.center)) {
      errors.push(`Transport stop ${stop?.id || '<unknown>'} has invalid center.`);
    }
  }

  for (const route of routes) {
    if (!route?.id) errors.push('Transport route is missing id.');
    else if (routeIds.has(route.id)) errors.push(`Duplicate transport route id: ${route.id}`);
    else routeIds.add(route.id);

    if (!['full', 'terminals_only', 'metadata_only'].includes(route?.coverage)) {
      errors.push(`Transport route ${route?.id || '<unknown>'} has invalid coverage.`);
    }

    validateRouteGeometry(route, errors);

    if (!Array.isArray(route?.stopIds)) {
      errors.push(`Transport route ${route?.id || '<unknown>'} must contain a stopIds array.`);
      continue;
    }

    const variants = Array.isArray(route.variants) ? route.variants : [];
    const hasFullVariant = variants.some((variant) => Array.isArray(variant.stopIds) && variant.stopIds.length >= 2);
    const minimumStops = route.coverage === 'metadata_only' || (route.coverage === 'full' && hasFullVariant) ? 0 : 2;
    if (route.stopIds.length < minimumStops) {
      errors.push(`Transport route ${route.id} needs at least ${minimumStops} stops for ${route.coverage} coverage.`);
    }

    for (const stopId of route.stopIds) {
      if (!stopIds.has(stopId)) errors.push(`Transport route ${route.id} references missing stop ${stopId}.`);
    }

    if (route.coverage === 'full' && route.stopIds.length < 2 && !hasFullVariant) {
      errors.push(`Transport route ${route.id} has full coverage without a full stop sequence or route variant.`);
    }

    for (const variant of variants) {
      if (!variant?.id) errors.push(`Transport route ${route.id} has a variant without id.`);
      else if (variantIds.has(variant.id)) errors.push(`Duplicate transport route variant id: ${variant.id}`);
      else variantIds.add(variant.id);

      if (variant.ref !== route.ref) {
        errors.push(`Transport route variant ${variant.id} ref does not match route ${route.id}.`);
      }
      validateRouteGeometry(variant, errors);
      if (!Array.isArray(variant.stopIds)) {
        errors.push(`Transport route variant ${variant.id} must contain a stopIds array.`);
        continue;
      }
      if (variant.stopIds.length === 1) {
        errors.push(`Transport route variant ${variant.id} cannot contain exactly one stop.`);
      }
      if (variant.stopIds.length === 0 && !variant.geometry) {
        errors.push(`Transport route variant ${variant.id} needs map geometry or at least 2 stops.`);
      }
      for (const stopId of variant.stopIds) {
        if (!stopIds.has(stopId)) errors.push(`Transport route variant ${variant.id} references missing stop ${stopId}.`);
      }
    }
  }

  for (const transfer of transfers) {
    if (!Array.isArray(transfer?.stopIds) || transfer.stopIds.length !== 2) {
      errors.push(`Transport transfer ${transfer?.id || '<unknown>'} must connect exactly two stops.`);
      continue;
    }
    for (const stopId of transfer.stopIds) {
      if (!stopIds.has(stopId)) errors.push(`Transport transfer ${transfer.id} references missing stop ${stopId}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
