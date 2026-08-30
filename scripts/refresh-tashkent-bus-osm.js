import { writeFile } from 'node:fs/promises';
import { TASHKENT_BUS_ROUTE_REFS_2026_08_18 } from '../src/transport/tashkent-bus.js';
import stopRows1 from '../src/transport/generated/tashkent-bus-osm-stops-1.js';
import stopRows2 from '../src/transport/generated/tashkent-bus-osm-stops-2.js';
import stopRows3 from '../src/transport/generated/tashkent-bus-osm-stops-3.js';
import stopRows4 from '../src/transport/generated/tashkent-bus-osm-stops-4.js';
import variantRows1 from '../src/transport/generated/tashkent-bus-osm-variants-1.js';
import variantRows2 from '../src/transport/generated/tashkent-bus-osm-variants-2.js';
import variantRows3 from '../src/transport/generated/tashkent-bus-osm-variants-3.js';
import shapeRows1 from '../src/transport/generated/tashkent-bus-osm-shapes-1.js';
import shapeRows2 from '../src/transport/generated/tashkent-bus-osm-shapes-2.js';
import shapeRows3 from '../src/transport/generated/tashkent-bus-osm-shapes-3.js';

const SOURCE_DATE = new Date().toISOString().slice(0, 10);
const BBOX = Object.freeze({ south: 41.15, west: 69.10, north: 41.45, east: 69.50 });
const BBOX_QUERY = `${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east}`;
const BATCH_SIZE = 12;
const STOP_PARTS = 4;
const VARIANT_PARTS = 3;
const SHAPE_PARTS = 3;
const REQUEST_TIMEOUT_MS = 35_000;
const OVERPASS_ENDPOINTS = Object.freeze([
  process.env.OVERPASS_URL,
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
].filter(Boolean));

const OLD_STOP_ROWS = Object.freeze([...stopRows1, ...stopRows2, ...stopRows3, ...stopRows4]);
const OLD_VARIANT_ROWS = Object.freeze([...variantRows1, ...variantRows2, ...variantRows3]);
const OLD_SHAPE_ROWS = Object.freeze([...shapeRows1, ...shapeRows2, ...shapeRows3]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const round6 = (value) => Math.round(value * 1e6) / 1e6;
const normalizeRef = (value) => String(value ?? '').trim().toUpperCase();
const osmKey = (type, id) => `${type}:${id}`;
const rowKey = (row) => osmKey(row[0], row[1]);

const registryByNormalizedRef = new Map(
  TASHKENT_BUS_ROUTE_REFS_2026_08_18.map((ref) => [normalizeRef(ref), ref]),
);

const compareRefs = (a, b) => {
  const aNumber = Number.parseInt(a, 10);
  const bNumber = Number.parseInt(b, 10);
  if (aNumber !== bNumber) return aNumber - bNumber;
  return a.localeCompare(b, 'en', { numeric: true });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const insideBbox = ([lng, lat]) =>
  lat >= BBOX.south && lat <= BBOX.north && lng >= BBOX.west && lng <= BBOX.east;

function memberPoint(member) {
  if (!member) return null;
  if (member.type === 'node' && Number.isFinite(member.lat) && Number.isFinite(member.lon)) {
    return [round6(member.lon), round6(member.lat)];
  }
  const geometry = Array.isArray(member.geometry)
    ? member.geometry.filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lon))
    : [];
  if (!geometry.length) return null;
  const sum = geometry.reduce((acc, point) => {
    acc.lng += point.lon;
    acc.lat += point.lat;
    return acc;
  }, { lng: 0, lat: 0 });
  return [round6(sum.lng / geometry.length), round6(sum.lat / geometry.length)];
}

function passengerMembers(relation) {
  const members = relation.members || [];
  const platforms = members.filter((member) => String(member.role || '').startsWith('platform'));
  if (platforms.length >= 2) return platforms;

  const stops = members.filter((member) => String(member.role || '').startsWith('stop'));
  if (stops.length >= 2) return stops;

  return [];
}

function buildShape(relation) {
  const segments = [];
  for (const member of relation.members || []) {
    if (member.type !== 'way') continue;
    const role = String(member.role || '');
    if (role.startsWith('platform') || role.startsWith('stop')) continue;
    const coordinates = (member.geometry || [])
      .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lon))
      .map((point) => [round6(point.lon), round6(point.lat)]);
    if (coordinates.length >= 2) segments.push(coordinates);
  }
  if (!segments.length) return null;

  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (const segment of segments) {
    for (const [lng, lat] of segment) {
      west = Math.min(west, lng);
      south = Math.min(south, lat);
      east = Math.max(east, lng);
      north = Math.max(north, lat);
    }
  }
  return { segments, bounds: [west, south, east, north] };
}

function buildCandidate(relation, stopRecords) {
  const normalized = normalizeRef(relation.tags?.ref);
  const ref = registryByNormalizedRef.get(normalized);
  if (!ref) return null;

  const members = passengerMembers(relation);
  const stopKeys = [];
  const stopPoints = [];
  for (const member of members) {
    const point = memberPoint(member);
    if (!point) continue;
    const key = osmKey(member.type, member.ref);
    const previous = stopRecords.get(key);
    stopRecords.set(key, [member.type, member.ref, previous?.[2] ?? null, point[1], point[0]]);
    if (stopKeys.at(-1) !== key) {
      stopKeys.push(key);
      stopPoints.push(point);
    }
  }

  if (stopKeys.length < 2) return null;
  const insideCount = stopPoints.filter(insideBbox).length;
  if (insideCount < 2 || insideCount / stopPoints.length < 0.5) return null;

  const shape = buildShape(relation);
  if (!shape) return null;

  const tags = relation.tags || {};
  return {
    ref,
    relationId: relation.id,
    from: tags.from || null,
    to: tags.to || null,
    operator: tags.operator || null,
    network: tags.network || null,
    stopKeys,
    shape,
  };
}

function relationQuery(refs) {
  const regex = `^(?:${refs.map((ref) => escapeRegex(ref)).join('|')})$`;
  return `[out:json][timeout:45];rel["type"="route"]["route"="bus"]["ref"~"${regex}"](${BBOX_QUERY});out body geom;`;
}

async function fetchBatch(refs) {
  const query = relationQuery(refs);
  const failures = [];
  for (const endpoint of OVERPASS_ENDPOINTS) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'user-agent': '@whiteslove/geo-catalog Tashkent bus discovery refresh',
          },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (!response.ok) {
          const text = (await response.text()).replace(/\s+/g, ' ').slice(0, 280);
          throw new Error(`${response.status} ${text}`);
        }
        return await response.json();
      } catch (error) {
        const message = `${endpoint} attempt ${attempt}: ${error?.message || error}`;
        failures.push(message);
        console.warn(message);
        await sleep(900 * attempt);
      }
    }
  }
  throw new Error(`All Overpass endpoints failed for refs ${refs.join(', ')}: ${failures.join(' | ')}`);
}

function existingState() {
  const stopRecords = new Map(OLD_STOP_ROWS.map((row) => [rowKey(row), [...row]]));
  const variants = new Map();
  for (const row of OLD_VARIANT_ROWS) {
    const [ref, relationId, from, to, operator, network, stopIndexes] = row;
    variants.set(relationId, {
      ref,
      relationId,
      from,
      to,
      operator,
      network,
      stopKeys: stopIndexes.map((index) => rowKey(OLD_STOP_ROWS[index])),
    });
  }
  const shapes = new Map(OLD_SHAPE_ROWS.map((row) => [row[0], { segments: row[1], bounds: row[2] }]));
  return { stopRecords, variants, shapes };
}

function splitRows(rows, parts) {
  const chunkSize = Math.ceil(rows.length / parts) || 1;
  return Array.from({ length: parts }, (_, index) => rows.slice(index * chunkSize, (index + 1) * chunkSize));
}

async function writeParts(prefix, rows, parts, header) {
  const chunks = splitRows(rows, parts);
  await Promise.all(chunks.map(async (chunk, index) => {
    const path = new URL(`../src/transport/generated/${prefix}-${index + 1}.js`, import.meta.url);
    const content = `// Generated from OSM Overpass ${SOURCE_DATE}; ODbL.\n${header}\nexport default Object.freeze(${JSON.stringify(chunk)});\n`;
    await writeFile(path, content, 'utf8');
  }));
}

const state = existingState();
const oldRelationIds = new Set(state.variants.keys());
const oldRefs = new Set([...state.variants.values()].map((variant) => variant.ref));
const failedRefs = [];

for (let offset = 0; offset < TASHKENT_BUS_ROUTE_REFS_2026_08_18.length; offset += BATCH_SIZE) {
  const refs = TASHKENT_BUS_ROUTE_REFS_2026_08_18.slice(offset, offset + BATCH_SIZE);
  console.log(`Discovering bus refs ${offset + 1}-${Math.min(offset + refs.length, TASHKENT_BUS_ROUTE_REFS_2026_08_18.length)} / ${TASHKENT_BUS_ROUTE_REFS_2026_08_18.length}: ${refs.join(', ')}`);

  let payload;
  try {
    payload = await fetchBatch(refs);
  } catch (error) {
    console.warn(error?.message || error);
    failedRefs.push(...refs);
    continue;
  }

  const candidatesByRef = new Map();
  for (const relation of (payload.elements || []).filter((element) =>
    element.type === 'relation' && element.tags?.type === 'route' && element.tags?.route === 'bus'
  )) {
    const candidate = buildCandidate(relation, state.stopRecords);
    if (!candidate) continue;
    const items = candidatesByRef.get(candidate.ref) ?? [];
    items.push(candidate);
    candidatesByRef.set(candidate.ref, items);
  }

  for (const ref of refs) {
    const candidates = candidatesByRef.get(ref);
    if (!candidates?.length) continue;

    for (const [relationId, variant] of [...state.variants]) {
      if (variant.ref !== ref) continue;
      state.variants.delete(relationId);
      state.shapes.delete(relationId);
    }

    for (const candidate of candidates) {
      state.variants.set(candidate.relationId, candidate);
      state.shapes.set(candidate.relationId, candidate.shape);
    }
  }

  await sleep(250);
}

const variants = [...state.variants.values()].sort((a, b) =>
  compareRefs(a.ref, b.ref) || a.relationId - b.relationId,
);
const referencedStopKeys = new Set(variants.flatMap((variant) => variant.stopKeys));
const stopRows = [...referencedStopKeys]
  .map((key) => state.stopRecords.get(key))
  .filter(Boolean)
  .sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
const stopIndexByKey = new Map(stopRows.map((row, index) => [rowKey(row), index]));
const variantRows = variants.map((variant) => [
  variant.ref,
  variant.relationId,
  variant.from,
  variant.to,
  variant.operator,
  variant.network,
  variant.stopKeys.map((key) => stopIndexByKey.get(key)).filter(Number.isInteger),
]);
const shapeRows = variants.map((variant) => {
  const shape = state.shapes.get(variant.relationId);
  if (!shape) throw new Error(`Missing shape for discovered relation ${variant.relationId}`);
  return [variant.relationId, shape.segments, shape.bounds];
});

await writeParts(
  'tashkent-bus-osm-stops',
  stopRows,
  STOP_PARTS,
  '// Rows: [osmType, osmId, canonicalName, lat, lng]',
);
await writeParts(
  'tashkent-bus-osm-variants',
  variantRows,
  VARIANT_PARTS,
  '// Rows: [ref, relationId, from, to, operator, network, stopIndexes]',
);
await writeParts(
  'tashkent-bus-osm-shapes',
  shapeRows,
  SHAPE_PARTS,
  '// Rows: [relationId, multiLineCoordinates, [west,south,east,north]]',
);

const newRelationIds = new Set(variants.map((variant) => variant.relationId));
const newRefs = new Set(variants.map((variant) => variant.ref));
const addedRelations = [...newRelationIds].filter((id) => !oldRelationIds.has(id));
const removedRelations = [...oldRelationIds].filter((id) => !newRelationIds.has(id));
const addedRefs = [...newRefs].filter((ref) => !oldRefs.has(ref)).sort(compareRefs);
const lostRefs = [...oldRefs].filter((ref) => !newRefs.has(ref)).sort(compareRefs);

console.log(`OSM bus discovery complete: ${newRefs.size}/${TASHKENT_BUS_ROUTE_REFS_2026_08_18.length} registry refs, ${variants.length} variants, ${stopRows.length} unique passenger stops.`);
console.log(`Added refs (${addedRefs.length}): ${addedRefs.join(', ') || 'none'}`);
console.log(`Added relations: ${addedRelations.length}; removed relations: ${removedRelations.length}; lost refs: ${lostRefs.join(', ') || 'none'}.`);
if (failedRefs.length) console.warn(`Preserved existing data for failed discovery refs (${failedRefs.length}): ${failedRefs.join(', ')}`);
