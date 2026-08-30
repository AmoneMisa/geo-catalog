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
  const { country, cityId, mode } = filters;
  return TRANSPORT_STOPS.filter((stop) =>
    (!country || stop.country === country) &&
    (!cityId || stop.cityId === cityId) &&
    (!mode || stop.mode === mode)
  );
}

export function findTransportRoutes(filters = {}) {
  const { country, cityId, mode, ref, coverage } = filters;
  return TRANSPORT_ROUTES.filter((route) =>
    (!country || route.country === country) &&
    (!cityId || route.cityId === cityId) &&
    (!mode || route.mode === mode) &&
    (!ref || route.ref === ref) &&
    (!coverage || route.coverage === coverage)
  );
}

export function findTransportRouteVariants(filters = {}) {
  const { country, cityId, mode, ref } = filters;
  return TRANSPORT_ROUTE_VARIANTS.filter((variant) =>
    (!country || variant.country === country) &&
    (!cityId || variant.cityId === cityId) &&
    (!mode || variant.mode === mode) &&
    (!ref || variant.ref === ref)
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

const isValidCoordinate = (center) =>
  center &&
  Number.isFinite(center.lat) &&
  Number.isFinite(center.lng) &&
  center.lat >= -90 && center.lat <= 90 &&
  center.lng >= -180 && center.lng <= 180;

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
      if (!Array.isArray(variant.stopIds) || variant.stopIds.length < 2) {
        errors.push(`Transport route variant ${variant.id} needs at least 2 stops.`);
        continue;
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
