import {
  TRANSPORT_ROUTE_VARIANTS,
  findTransportRoutes,
  getTransportCoverage,
  getTransportMapCoverage,
} from '../src/transport/catalog.js';

const filters = Object.freeze({ cityId: 'uz:tashkent', mode: 'bus' });
const routes = findTransportRoutes(filters);
const topology = getTransportCoverage(filters);
const map = getTransportMapCoverage(filters);

const hasGeometry = (route) =>
  Boolean(route.geometry) || (route.variants?.some((variant) => Boolean(variant.geometry)) ?? false);
const refs = (items) => items.map((route) => route.ref).sort((a, b) =>
  String(a).localeCompare(String(b), undefined, { numeric: true }),
);

const full = routes.filter((route) => route.coverage === 'full');
const terminalsOnly = routes.filter((route) => route.coverage === 'terminals_only');
const metadataOnly = routes.filter((route) => route.coverage === 'metadata_only');
const shapeOnly = metadataOnly.filter(hasGeometry);
const terminalGeometry = terminalsOnly.filter(hasGeometry);
const withoutGeometry = routes.filter((route) => !hasGeometry(route));
const uniqueRefs = new Set(routes.map((route) => route.ref));

const failures = [];
if (routes.length !== 170) failures.push(`expected 170 routes, got ${routes.length}`);
if (uniqueRefs.size !== routes.length) failures.push(`expected unique route refs, got ${uniqueRefs.size}/${routes.length}`);
if (topology.total !== routes.length) failures.push(`topology total ${topology.total} != route total ${routes.length}`);
if (topology.full + topology.terminalsOnly + topology.metadataOnly !== routes.length) {
  failures.push('topology coverage buckets do not partition all routes');
}
if (map.total !== routes.length) failures.push(`map total ${map.total} != route total ${routes.length}`);
if (map.withGeometry + map.withoutGeometry !== routes.length) {
  failures.push('map geometry buckets do not partition all routes');
}
if (map.variantsWithGeometry !== TRANSPORT_ROUTE_VARIANTS.filter((variant) => Boolean(variant.geometry)).length) {
  failures.push('map variant geometry count is inconsistent');
}
if (full.filter(hasGeometry).length + terminalGeometry.length + shapeOnly.length !== map.withGeometry) {
  failures.push('route geometry buckets do not partition routes with geometry');
}

console.log('Tashkent bus coverage audit');
console.log(`  routes: ${routes.length}`);
console.log(`  topology: full=${full.length}, terminals_only=${terminalsOnly.length}, metadata_only=${metadataOnly.length}`);
console.log(`  map: with_geometry=${map.withGeometry}, without_geometry=${map.withoutGeometry}, shape_only=${shapeOnly.length}, terminal_geometry=${terminalGeometry.length}`);
console.log(`  OSM variants with geometry: ${map.variantsWithGeometry}`);
console.log(`  terminals_only refs: ${refs(terminalsOnly).join(', ') || '(none)'}`);
console.log(`  metadata_only refs: ${refs(metadataOnly).join(', ') || '(none)'}`);
console.log(`  shape_only refs: ${refs(shapeOnly).join(', ') || '(none)'}`);
console.log(`  terminal_geometry refs: ${refs(terminalGeometry).join(', ') || '(none)'}`);
console.log(`  without_geometry refs: ${refs(withoutGeometry).join(', ') || '(none)'}`);

if (failures.length) {
  for (const failure of failures) console.error(`Transport coverage audit failed: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Tashkent bus route registry and coverage buckets are internally consistent.');
}
