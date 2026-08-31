import stopRows1 from './generated/tashkent-bus-osm-stops-1.js';
import stopRows2 from './generated/tashkent-bus-osm-stops-2.js';
import stopRows3 from './generated/tashkent-bus-osm-stops-3.js';
import stopRows4 from './generated/tashkent-bus-osm-stops-4.js';
import variantRows1 from './generated/tashkent-bus-osm-variants-1.js';
import variantRows2 from './generated/tashkent-bus-osm-variants-2.js';
import variantRows3 from './generated/tashkent-bus-osm-variants-3.js';
import shapeRows1 from './generated/tashkent-bus-osm-shapes-1.js';
import shapeRows2 from './generated/tashkent-bus-osm-shapes-2.js';
import shapeRows3 from './generated/tashkent-bus-osm-shapes-3.js';

const OSM_SNAPSHOT_DATE = '2026-08-31';

const STOP_ROWS = Object.freeze([
  ...stopRows1,
  ...stopRows2,
  ...stopRows3,
  ...stopRows4,
]);

const VARIANT_ROWS = Object.freeze([
  ...variantRows1,
  ...variantRows2,
  ...variantRows3,
]);

const SHAPE_ROWS = Object.freeze([
  ...shapeRows1,
  ...shapeRows2,
  ...shapeRows3,
]);

const SHAPES_BY_RELATION = new Map(SHAPE_ROWS.map((row) => [row[0], row]));
const stopId = ([osmType, osmId]) => `uz:tashkent:stop:bus:osm:${osmType}:${osmId}`;

const freezeMultiLine = (segments) => Object.freeze(segments.map((segment) =>
  Object.freeze(segment.map(([lng, lat]) => Object.freeze([lng, lat]))),
));

export const TASHKENT_BUS_OSM_STOPS = Object.freeze(STOP_ROWS.map((row) => {
  const [osmType, osmId, canonicalName, lat, lng] = row;
  return Object.freeze({
    id: stopId(row),
    type: 'stop',
    mode: 'bus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    canonicalName: canonicalName || `OSM bus platform ${osmId}`,
    center: Object.freeze({ lat, lng }),
    source: 'osm',
    sourceUpdatedAt: OSM_SNAPSHOT_DATE,
    accuracy: 'poi',
    accuracyM: 35,
    osm: Object.freeze({ type: osmType, id: osmId }),
  });
}));

const variantsPerRef = new Map();

export const TASHKENT_BUS_OSM_ROUTE_VARIANTS = Object.freeze(VARIANT_ROWS.map((row) => {
  const [ref, relationId, from, to, operator, network, stopIndexes] = row;
  const variantIndex = variantsPerRef.get(ref) ?? 0;
  variantsPerRef.set(ref, variantIndex + 1);

  const shapeRow = SHAPES_BY_RELATION.get(relationId);
  const shape = shapeRow
    ? {
        geometry: Object.freeze({
          type: 'MultiLineString',
          coordinates: freezeMultiLine(shapeRow[1]),
        }),
        bounds: Object.freeze({
          west: shapeRow[2][0],
          south: shapeRow[2][1],
          east: shapeRow[2][2],
          north: shapeRow[2][3],
        }),
        geometrySource: 'osm',
        geometryUpdatedAt: OSM_SNAPSHOT_DATE,
      }
    : {};

  return Object.freeze({
    id: `uz:tashkent:route:bus:${String(ref).toLowerCase()}:osm:${relationId}`,
    type: 'route_variant',
    mode: 'bus',
    country: 'UZ',
    cityId: 'uz:tashkent',
    ref,
    variantIndex,
    canonicalName: `Route ${ref}: ${from || '?'} → ${to || '?'}`,
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(operator ? { operator } : {}),
    ...(network ? { network } : {}),
    source: 'osm',
    sourceUpdatedAt: OSM_SNAPSHOT_DATE,
    osm: Object.freeze({ type: 'relation', id: relationId }),
    ...shape,
    stopIds: Object.freeze(stopIndexes.map((index) => {
      const stop = STOP_ROWS[index];
      if (!stop) throw new Error(`OSM bus variant ${relationId} references missing stop row ${index}.`);
      return stopId(stop);
    })),
  });
}));

export const TASHKENT_BUS_OSM_ROUTE_REFS = Object.freeze([
  ...new Set(TASHKENT_BUS_OSM_ROUTE_VARIANTS.map((variant) => variant.ref)),
]);

export const TASHKENT_BUS_OSM_SHAPE_COUNT = SHAPE_ROWS.length;