import {
  TASHKENT_BUS_ROUTES as REGISTRY_ROUTES,
  TASHKENT_BUS_STOPS as REGISTRY_STOPS,
} from './tashkent-bus.js';
import {
  TASHKENT_BUS_OSM_ROUTE_VARIANTS,
  TASHKENT_BUS_OSM_STOPS,
} from './tashkent-bus-osm.js';
import {
  TASHKENT_BUS_OFFICIAL_ROUTE_VARIANTS,
  TASHKENT_BUS_OFFICIAL_STOPS,
} from './tashkent-bus-official.js';

const variantsByRef = new Map();
const allVariants = Object.freeze([
  ...TASHKENT_BUS_OSM_ROUTE_VARIANTS,
  ...TASHKENT_BUS_OFFICIAL_ROUTE_VARIANTS,
]);

for (const variant of allVariants) {
  const variants = variantsByRef.get(variant.ref) ?? [];
  variants.push(variant);
  variantsByRef.set(variant.ref, variants);
}

const latestDate = (values) => values.filter(Boolean).sort().at(-1);
const combinedSource = (variants, field) => {
  const sources = [...new Set(variants.map((variant) => variant[field]).filter(Boolean))];
  return sources.length === 1 ? sources[0] : 'mixed';
};

export const TASHKENT_BUS_STOPS = Object.freeze([
  ...REGISTRY_STOPS,
  ...TASHKENT_BUS_OSM_STOPS,
  ...TASHKENT_BUS_OFFICIAL_STOPS,
]);

export const TASHKENT_BUS_ROUTES = Object.freeze(REGISTRY_ROUTES.map((route) => {
  const variants = variantsByRef.get(route.ref);
  if (!variants?.length) return route;

  const topologyVariants = variants.filter((variant) => variant.stopIds.length >= 2);
  const hasTopology = topologyVariants.length > 0;
  const geometryVariants = variants.filter((variant) => variant.geometry);
  const hasGeometry = geometryVariants.length > 0;

  return Object.freeze({
    ...route,
    ...(hasTopology ? {
      coverage: 'full',
      topologySource: combinedSource(topologyVariants, 'source'),
      topologyUpdatedAt: latestDate(topologyVariants.map((variant) => variant.sourceUpdatedAt)),
    } : {}),
    ...(hasGeometry ? {
      mapGeometrySource: combinedSource(geometryVariants, 'geometrySource'),
      mapGeometryUpdatedAt: latestDate(geometryVariants.map((variant) => variant.geometryUpdatedAt)),
    } : {}),
    variants: Object.freeze([...variants]),
  });
}));

export const TASHKENT_BUS_ROUTE_VARIANTS = allVariants;
