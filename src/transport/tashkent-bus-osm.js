import stopRows1 from './generated/tashkent-bus-osm-stops-1.js';
import stopRows2 from './generated/tashkent-bus-osm-stops-2.js';
import stopRows3 from './generated/tashkent-bus-osm-stops-3.js';
import stopRows4 from './generated/tashkent-bus-osm-stops-4.js';
import variantRows1 from './generated/tashkent-bus-osm-variants-1.js';
import variantRows2 from './generated/tashkent-bus-osm-variants-2.js';
import variantRows3 from './generated/tashkent-bus-osm-variants-3.js';

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

const stopId = ([osmType, osmId]) => `uz:tashkent:stop:bus:osm:${osmType}:${osmId}`;

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
    sourceUpdatedAt: '2026-08-30',
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
    sourceUpdatedAt: '2026-08-30',
    osm: Object.freeze({ type: 'relation', id: relationId }),
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
