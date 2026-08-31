import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
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
const outputDir = resolve(process.argv[2] || '.');

const sortRefs = (items) => [...items].sort((a, b) =>
  String(a).localeCompare(String(b), undefined, { numeric: true }),
);

const hasGeometry = (route) =>
  Boolean(route.geometry) || (route.variants?.some((variant) => Boolean(variant.geometry)) ?? false);

const routeTerminals = (route) => {
  const values = [
    ...(route.terminalNames || []),
    ...(route.variants || []).flatMap((variant) => [variant.from, variant.to]),
  ].filter(Boolean).map((value) => String(value).trim()).filter(Boolean);
  return [...new Set(values)];
};

const rows = routes.map((route) => {
  const geometry = hasGeometry(route);
  const terminals = routeTerminals(route);
  const gaps = [];
  if (route.coverage !== 'full') gaps.push('topology');
  if (!geometry) gaps.push('geometry');
  if (terminals.length < 2) gaps.push('terminals');

  return Object.freeze({
    ref: route.ref,
    routeId: route.id,
    coverage: route.coverage,
    hasGeometry: geometry,
    topologyStopCount: route.stopIds?.length || 0,
    variantCount: route.variants?.length || 0,
    terminals,
    gaps,
  });
});

const refsWhere = (predicate) => sortRefs(rows.filter(predicate).map((row) => row.ref));
const groups = Object.freeze({
  full: refsWhere((row) => row.coverage === 'full'),
  terminalsOnly: refsWhere((row) => row.coverage === 'terminals_only'),
  metadataOnly: refsWhere((row) => row.coverage === 'metadata_only'),
  geometryOnly: refsWhere((row) => row.coverage === 'metadata_only' && row.hasGeometry),
  missingTopology: refsWhere((row) => row.gaps.includes('topology')),
  missingGeometry: refsWhere((row) => row.gaps.includes('geometry')),
  missingTerminals: refsWhere((row) => row.gaps.includes('terminals')),
});

const report = Object.freeze({
  generatedAt: new Date().toISOString(),
  cityId: 'uz:tashkent',
  mode: 'bus',
  summary: Object.freeze({
    routes: routes.length,
    full: topology.full,
    terminalsOnly: topology.terminalsOnly,
    metadataOnly: topology.metadataOnly,
    withGeometry: map.withGeometry,
    withoutGeometry: map.withoutGeometry,
    variantsWithGeometry: map.variantsWithGeometry,
    allVariants: TRANSPORT_ROUTE_VARIANTS.filter((variant) => variant.cityId === 'uz:tashkent' && variant.mode === 'bus').length,
    missingTopology: groups.missingTopology.length,
    missingGeometry: groups.missingGeometry.length,
    missingTerminals: groups.missingTerminals.length,
  }),
  groups,
  routes: rows,
});

if (routes.length !== 171) {
  throw new Error(`Expected 171 Tashkent bus route refs, got ${routes.length}`);
}

await mkdir(outputDir, { recursive: true });

const jsonPath = join(outputDir, 'tashkent-bus-gaps.json');
const csvPath = join(outputDir, 'tashkent-bus-gaps.csv');
const textPath = join(outputDir, 'tashkent-bus-gaps.txt');

const csvEscape = (value) => {
  const text = String(value ?? '');
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const csvRows = rows.filter((row) => row.gaps.length).map((row) => [
  row.ref,
  row.coverage,
  row.hasGeometry,
  row.topologyStopCount,
  row.variantCount,
  row.terminals.join(' | '),
  row.gaps.join(' | '),
].map(csvEscape).join(','));

const text = [
  'Tashkent bus coverage gaps',
  `Generated: ${report.generatedAt}`,
  '',
  `Routes: ${report.summary.routes}`,
  `Topology: full=${report.summary.full}, terminals_only=${report.summary.terminalsOnly}, metadata_only=${report.summary.metadataOnly}`,
  `Geometry: with=${report.summary.withGeometry}, without=${report.summary.withoutGeometry}`,
  `OSM variants with geometry: ${report.summary.variantsWithGeometry}`,
  '',
  `Terminals-only (${groups.terminalsOnly.length}): ${groups.terminalsOnly.join(', ') || '(none)'}`,
  `Metadata-only (${groups.metadataOnly.length}): ${groups.metadataOnly.join(', ') || '(none)'}`,
  `Geometry-only (${groups.geometryOnly.length}): ${groups.geometryOnly.join(', ') || '(none)'}`,
  `Missing topology (${groups.missingTopology.length}): ${groups.missingTopology.join(', ') || '(none)'}`,
  `Missing geometry (${groups.missingGeometry.length}): ${groups.missingGeometry.join(', ') || '(none)'}`,
  `Missing terminals (${groups.missingTerminals.length}): ${groups.missingTerminals.join(', ') || '(none)'}`,
  '',
].join('\n');

await Promise.all([
  writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
  writeFile(csvPath, [
    'ref,coverage,has_geometry,topology_stop_count,variant_count,terminals,gaps',
    ...csvRows,
    '',
  ].join('\n'), 'utf8'),
  writeFile(textPath, text, 'utf8'),
]);

console.log(text.trimEnd());
console.log('');
console.log(`JSON: ${jsonPath}`);
console.log(`CSV:  ${csvPath}`);
console.log(`TXT:  ${textPath}`);
