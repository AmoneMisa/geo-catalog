import {
  TASHKENT_METRO_ROUTES,
  TASHKENT_METRO_STOPS,
  TASHKENT_METRO_TRANSFERS,
} from './tashkent-metro.js';
import {
  TASHKENT_BUS_ROUTES,
  TASHKENT_BUS_STOPS,
} from './tashkent-bus.js';

export const TRANSPORT_STOPS = Object.freeze([
  ...TASHKENT_METRO_STOPS,
  ...TASHKENT_BUS_STOPS,
]);

export const TRANSPORT_ROUTES = Object.freeze([
  ...TASHKENT_METRO_ROUTES,
  ...TASHKENT_BUS_ROUTES,
]);

export const TRANSPORT_TRANSFERS = Object.freeze([
  ...TASHKENT_METRO_TRANSFERS,
]);

const stopsById = new Map(TRANSPORT_STOPS.map((stop) => [stop.id, stop]));
const routesById = new Map(TRANSPORT_ROUTES.map((route) => [route.id, route]));

export function getTransportStop(id) {
  return stopsById.get(String(id || '')) ?? null;
}

export function getTransportRoute(id) {
  return routesById.get(String(id || '')) ?? null;
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

export function getRoutesForStop(stopId, options = {}) {
  const id = String(stopId || '');
  const { requireFullSequence = false } = options;
  return TRANSPORT_ROUTES.filter((route) =>
    route.stopIds.includes(id) && (!requireFullSequence || route.coverage === 'full')
  );
}

export function getStopsForRoute(routeId) {
  const route = getTransportRoute(routeId);
  if (!route) return [];
  return route.stopIds.map((id) => stopsById.get(id)).filter(Boolean);
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

export function validateTransportCatalog({
  stops = TRANSPORT_STOPS,
  routes = TRANSPORT_ROUTES,
  transfers = TRANSPORT_TRANSFERS,
} = {}) {
  const errors = [];
  const stopIds = new Set();
  const routeIds = new Set();

  for (const stop of stops) {
    if (!stop?.id) errors.push('Transport stop is missing id.');
    else if (stopIds.has(stop.id)) errors.push(`Duplicate transport stop id: ${stop.id}`);
    else stopIds.add(stop.id);

    if (!stop?.center || !Number.isFinite(stop.center.lat) || !Number.isFinite(stop.center.lng)) {
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

    const minimumStops = route.coverage === 'metadata_only' ? 0 : 2;
    if (route.stopIds.length < minimumStops) {
      errors.push(`Transport route ${route.id} needs at least ${minimumStops} stops for ${route.coverage} coverage.`);
    }

    for (const stopId of route.stopIds) {
      if (!stopIds.has(stopId)) errors.push(`Transport route ${route.id} references missing stop ${stopId}.`);
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
