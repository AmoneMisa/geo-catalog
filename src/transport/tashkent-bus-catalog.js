import {
  TASHKENT_BUS_ROUTES as REGISTRY_ROUTES,
  TASHKENT_BUS_STOPS as REGISTRY_STOPS,
} from './tashkent-bus.js';
import {
  TASHKENT_BUS_OSM_ROUTE_VARIANTS,
  TASHKENT_BUS_OSM_STOPS,
} from './tashkent-bus-osm.js';

const variantsByRef = new Map();
for (const variant of TASHKENT_BUS_OSM_ROUTE_VARIANTS) {
  const variants = variantsByRef.get(variant.ref) ?? [];
  variants.push(variant);
  variantsByRef.set(variant.ref, variants);
}

export const TASHKENT_BUS_STOPS = Object.freeze([
  ...REGISTRY_STOPS,
  ...TASHKENT_BUS_OSM_STOPS,
]);

export const TASHKENT_BUS_ROUTES = Object.freeze(REGISTRY_ROUTES.map((route) => {
  const variants = variantsByRef.get(route.ref);
  if (!variants?.length) return route;

  const topologyVariants = variants.filter((variant) => variant.stopIds.length >= 2);
  const hasTopology = topologyVariants.length > 0;
  const hasGeometry = variants.some((variant) => variant.geometry);

  return Object.freeze({
    ...route,
    ...(hasTopology ? {
      coverage: 'full',
      topologySource: 'osm',
      topologyUpdatedAt: '2026-08-30',
    } : {}),
    ...(hasGeometry ? {
      mapGeometrySource: 'osm',
      mapGeometryUpdatedAt: '2026-08-30',
    } : {}),
    variants: Object.freeze([...variants]),
  });
}));

export const TASHKENT_BUS_ROUTE_VARIANTS = TASHKENT_BUS_OSM_ROUTE_VARIANTS;
