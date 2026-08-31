import routeRows from './generated/tashkent-bus-official-routes.js';

const SNAPSHOT_DATE = '2026-08-31';
const stopKey = (officialId, direction) => `${officialId}:${direction}`;
const stopId = (officialId, direction) => `uz:tashkent:stop:bus:official:${officialId}:${direction}`;

const stopRows = new Map();
for (const [, directions] of routeRows) {
  for (const [, , stops] of directions) {
    for (const row of stops) stopRows.set(stopKey(row[0], row[1]), row);
  }
}

export const TASHKENT_BUS_OFFICIAL_STOPS = Object.freeze([...stopRows.values()].map((row) => {
  const [officialId, direction, canonicalName, lat, lng] = row;
  return Object.freeze({
    id: stopId(officialId, direction),
    type: 'stop',
    mode: 'bus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName,
    center: Object.freeze({ lat, lng }),
    source: 'official',
    sourceUpdatedAt: SNAPSHOT_DATE,
    accuracy: 'poi',
    accuracyM: 35,
  });
}));

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

export const TASHKENT_BUS_OFFICIAL_ROUTE_VARIANTS = Object.freeze(routeRows.flatMap(([ref, directions]) =>
  directions.map(([direction, coordinates, stops], variantIndex) => {
    const from = stops[0]?.[2];
    const to = stops.at(-1)?.[2];
    const frozenCoordinates = Object.freeze(coordinates.map((point) => Object.freeze(point)));
    return Object.freeze({
      id: `uz:tashkent:route:bus:${String(ref).toLowerCase()}:official:${direction}`,
      type: 'route_variant',
      mode: 'bus',
      country: 'UZ',
      cityId: 'uz:tashkent',
      ref,
      variantIndex,
      canonicalName: `Route ${ref}: ${from} → ${to}`,
      from,
      to,
      source: 'official',
      sourceUpdatedAt: SNAPSHOT_DATE,
      geometry: Object.freeze({
        type: 'MultiLineString',
        coordinates: Object.freeze([frozenCoordinates]),
      }),
      bounds: boundsFor(coordinates),
      geometrySource: 'official',
      geometryUpdatedAt: SNAPSHOT_DATE,
      stopIds: Object.freeze(stops.map((stop) => stopId(stop[0], stop[1]))),
    });
  }),
));
