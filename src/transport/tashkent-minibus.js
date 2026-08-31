import routeRows from './generated/tashkent-minibus-easyway-routes.js';

const SNAPSHOT_DATE = '2026-08-31';
const SOURCE = 'easyway';
const SOURCE_URL = 'https://uz.easyway.info/en/cities/tashkent/routes';
const stopKey = (providerId, direction) => `${providerId}:${direction}`;
const stopId = (providerId, direction) => `uz:tashkent:stop:minibus:easyway:${providerId}:${direction}`;

const stopRows = new Map();
for (const [, , directions] of routeRows) {
  for (const [, , stops] of directions) {
    for (const row of stops) stopRows.set(stopKey(row[0], row[1]), row);
  }
}

export const TASHKENT_MINIBUS_STOPS = Object.freeze([...stopRows.values()].map((row) => {
  const [providerId, direction, canonicalName, lat, lng] = row;
  return Object.freeze({
    id: stopId(providerId, direction),
    type: 'stop',
    mode: 'minibus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName,
    center: Object.freeze({ lat, lng }),
    source: SOURCE,
    sourceUpdatedAt: SNAPSHOT_DATE,
    accuracy: 'poi',
    accuracyM: 35,
  });
}));

const freezeCoordinates = (coordinates) => Object.freeze(coordinates.map((point) => Object.freeze(point)));

const boundsFor = (coordinates) => {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const [lng, lat] of coordinates) {
    west = Math.min(west, lng);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    north = Math.max(north, lat);
  }
  return Object.freeze({ west, south, east, north });
};

export const TASHKENT_MINIBUS_ROUTE_VARIANTS = Object.freeze(routeRows.flatMap(([ref, providerRouteId, directions]) =>
  directions.map(([direction, coordinates, stops], variantIndex) => {
    const from = stops[0][2];
    const to = stops.at(-1)[2];
    return Object.freeze({
      id: `uz:tashkent:route:minibus:${ref.toLowerCase()}:easyway:${providerRouteId}:${direction}`,
      type: 'route_variant',
      mode: 'minibus',
      country: 'UZ',
      cityId: 'uz:tashkent',
      ref,
      variantIndex,
      canonicalName: `Marshrutka ${ref}: ${from} → ${to}`,
      from,
      to,
      source: SOURCE,
      sourceUpdatedAt: SNAPSHOT_DATE,
      geometry: Object.freeze({
        type: 'MultiLineString',
        coordinates: Object.freeze([freezeCoordinates(coordinates)]),
      }),
      bounds: boundsFor(coordinates),
      geometrySource: SOURCE,
      geometryUpdatedAt: SNAPSHOT_DATE,
      stopIds: Object.freeze(stops.map((stop) => stopId(stop[0], stop[1]))),
    });
  }),
));

const variantsByRef = new Map();
for (const variant of TASHKENT_MINIBUS_ROUTE_VARIANTS) {
  const variants = variantsByRef.get(variant.ref) ?? [];
  variants.push(variant);
  variantsByRef.set(variant.ref, variants);
}

export const TASHKENT_MINIBUS_ROUTES = Object.freeze(routeRows.map(([ref]) => {
  const variants = Object.freeze(variantsByRef.get(ref));
  return Object.freeze({
    id: `uz:tashkent:route:minibus:${ref.toLowerCase()}`,
    type: 'route',
    mode: 'minibus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName: `Marshrutka ${ref}`,
    ref,
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    sourceUpdatedAt: SNAPSHOT_DATE,
    topologySource: SOURCE,
    topologyUpdatedAt: SNAPSHOT_DATE,
    mapGeometrySource: SOURCE,
    mapGeometryUpdatedAt: SNAPSHOT_DATE,
    coverage: 'full',
    stopIds: Object.freeze([]),
    variants,
  });
}));
