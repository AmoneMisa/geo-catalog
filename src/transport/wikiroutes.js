import RO_DATA from './generated/wikiroutes/ro.js';
import UA_DATA from './generated/wikiroutes/ua.js';
import UZ_DATA from './generated/wikiroutes/uz.js';
import KZ_DATA from './generated/wikiroutes/kz.js';
import KG_DATA from './generated/wikiroutes/kg.js';

const SOURCE = 'wikiroutes';
const BASE_URL = 'https://wikiroutes.info';
const MODE_BY_CODE = Object.freeze(['bus', 'minibus', 'trolleybus', 'tram', 'metro']);
const rows = Object.freeze([
  ...RO_DATA,
  ...UA_DATA,
  ...UZ_DATA,
  ...KZ_DATA,
  ...KG_DATA,
]);

function base64Bytes(value) {
  if (typeof Buffer !== 'undefined') return Uint8Array.from(Buffer.from(value, 'base64'));
  const binary = globalThis.atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeVarints(value) {
  const bytes = base64Bytes(value);
  const values = [];
  let current = 0;
  let shift = 0;

  for (const byte of bytes) {
    current += (byte & 0x7f) * (2 ** shift);
    if (byte & 0x80) {
      shift += 7;
      continue;
    }
    values.push(current);
    current = 0;
    shift = 0;
  }

  if (shift !== 0) throw new Error('Truncated WikiRoutes varint payload.');
  return values;
}

const unzigzag = (value) => value % 2 === 0 ? value / 2 : -((value + 1) / 2);

function decodeGeometry(value) {
  const numbers = decodeVarints(value);
  if (numbers.length % 2 !== 0) throw new Error('Invalid WikiRoutes geometry payload.');
  const coordinates = [];
  let lng = 0;
  let lat = 0;

  for (let index = 0; index < numbers.length; index += 2) {
    lng += unzigzag(numbers[index]);
    lat += unzigzag(numbers[index + 1]);
    coordinates.push(Object.freeze([lng / 1e5, lat / 1e5]));
  }

  return Object.freeze(coordinates);
}

const geometryFromCoordinates = (coordinates) => Object.freeze({
  type: 'MultiLineString',
  coordinates: Object.freeze([coordinates]),
});

function boundsFromCoordinates(coordinates) {
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  for (const [lng, lat] of coordinates) {
    west = Math.min(west, lng);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    north = Math.max(north, lat);
  }

  return Object.freeze({ west, south, east, north });
}

const stopId = (cityId, mode, sourceStopId) =>
  `${cityId}:stop:${mode}:wikiroutes:${sourceStopId}`;

const routeId = (cityId, mode, sourceRouteId) =>
  `${cityId}:route:${mode}:wikiroutes:${sourceRouteId}`;

const stops = [];
const routes = [];
const variants = [];

for (const [cityId, sourceSlug, sourceUpdatedAt, stopRows, routeRows] of rows) {
  const country = cityId.split(':', 1)[0].toUpperCase();
  const cityStops = stopRows.map(([sourceStopId, modeCode, canonicalName, latE6, lngE6]) => {
    const mode = MODE_BY_CODE[modeCode];
    if (!mode) throw new Error(`Unknown WikiRoutes mode code: ${modeCode}`);
    const stop = Object.freeze({
      id: stopId(cityId, mode, sourceStopId),
      type: 'stop',
      mode,
      country,
      cityId,
      canonicalName,
      center: Object.freeze({ lat: latE6 / 1e6, lng: lngE6 / 1e6 }),
      source: SOURCE,
      sourceUpdatedAt,
      accuracy: 'poi',
      accuracyM: 40,
    });
    stops.push(stop);
    return stop;
  });

  for (const [sourceRouteId, modeCode, ref, variantRows] of routeRows) {
    const mode = MODE_BY_CODE[modeCode];
    if (!mode) throw new Error(`Unknown WikiRoutes mode code: ${modeCode}`);
    const id = routeId(cityId, mode, sourceRouteId);
    const routeVariants = variantRows.map(([encodedStopIndexes, encodedGeometry], variantIndex) => {
      const stopIndexes = decodeVarints(encodedStopIndexes);
      const routeStops = stopIndexes.map((index) => cityStops[index]);
      if (routeStops.some((stop) => !stop)) throw new Error(`WikiRoutes route ${id} references an unknown stop index.`);
      const coordinates = decodeGeometry(encodedGeometry);
      if (coordinates.length < 2) throw new Error(`WikiRoutes route ${id} has an empty shape.`);
      const from = routeStops[0].canonicalName;
      const to = routeStops.at(-1).canonicalName;
      const variant = Object.freeze({
        id: `${id}:variant:${variantIndex}`,
        type: 'route_variant',
        mode,
        country,
        cityId,
        canonicalName: `${from} — ${to}`,
        ref,
        variantIndex,
        from,
        to,
        source: SOURCE,
        sourceUpdatedAt,
        geometry: geometryFromCoordinates(coordinates),
        bounds: boundsFromCoordinates(coordinates),
        geometrySource: SOURCE,
        geometryUpdatedAt: sourceUpdatedAt,
        stopIds: Object.freeze(routeStops.map((stop) => stop.id)),
      });
      variants.push(variant);
      return variant;
    });

    if (!routeVariants.length) continue;
    routes.push(Object.freeze({
      id,
      type: 'route',
      mode,
      country,
      cityId,
      canonicalName: `Route ${ref}`,
      ref,
      source: SOURCE,
      sourceUrl: `${BASE_URL}/en/${sourceSlug}?routes=${sourceRouteId}`,
      sourceUpdatedAt,
      topologySource: SOURCE,
      topologyUpdatedAt: sourceUpdatedAt,
      mapGeometrySource: SOURCE,
      mapGeometryUpdatedAt: sourceUpdatedAt,
      coverage: 'full',
      stopIds: routeVariants[0].stopIds,
      variants: Object.freeze(routeVariants),
    }));
  }
}

export const WIKIROUTES_STOPS = Object.freeze(stops);
export const WIKIROUTES_ROUTES = Object.freeze(routes);
export const WIKIROUTES_ROUTE_VARIANTS = Object.freeze(variants);
