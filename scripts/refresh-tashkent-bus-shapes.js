import { writeFile } from 'node:fs/promises';
import variantRows1 from '../src/transport/generated/tashkent-bus-osm-variants-1.js';
import variantRows2 from '../src/transport/generated/tashkent-bus-osm-variants-2.js';
import variantRows3 from '../src/transport/generated/tashkent-bus-osm-variants-3.js';

const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const SOURCE_DATE = new Date().toISOString().slice(0, 10);
const BATCH_SIZE = 18;
const OUTPUT_PARTS = 3;

const variantRows = [...variantRows1, ...variantRows2, ...variantRows3];
const relationIds = [...new Set(variantRows.map((row) => row[1]))].sort((a, b) => a - b);

const round6 = (value) => Math.round(value * 1e6) / 1e6;

function memberGeometry(member) {
  if (member?.type !== 'way' || !Array.isArray(member.geometry) || member.geometry.length < 2) return null;
  if (member.role === 'platform' || member.role === 'stop' || member.role === 'platform_entry_only' || member.role === 'platform_exit_only') return null;

  const coordinates = member.geometry
    .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lon))
    .map((point) => [round6(point.lon), round6(point.lat)]);

  if (coordinates.length < 2) return null;
  return coordinates;
}

function buildShape(relation) {
  const segments = (relation.members || []).map(memberGeometry).filter(Boolean);
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

  return [relation.id, segments, [west, south, east, north]];
}

async function fetchRelations(ids) {
  const query = `[out:json][timeout:180];rel(id:${ids.join(',')});out geom;`;
  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'user-agent': '@whiteslove/geo-catalog transport refresh',
    },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed (${response.status}): ${await response.text()}`);
  }

  const payload = await response.json();
  return (payload.elements || []).filter((element) => element.type === 'relation');
}

const shapes = [];
for (let offset = 0; offset < relationIds.length; offset += BATCH_SIZE) {
  const ids = relationIds.slice(offset, offset + BATCH_SIZE);
  console.log(`Fetching route relations ${offset + 1}-${Math.min(offset + ids.length, relationIds.length)} / ${relationIds.length}`);
  const relations = await fetchRelations(ids);
  for (const relation of relations) {
    const shape = buildShape(relation);
    if (shape) shapes.push(shape);
  }
}

shapes.sort((a, b) => a[0] - b[0]);

const chunkSize = Math.ceil(shapes.length / OUTPUT_PARTS);
for (let part = 0; part < OUTPUT_PARTS; part += 1) {
  const chunk = shapes.slice(part * chunkSize, (part + 1) * chunkSize);
  const path = new URL(`../src/transport/generated/tashkent-bus-osm-shapes-${part + 1}.js`, import.meta.url);
  const content = `// Generated from OSM Overpass ${SOURCE_DATE}; ODbL.\n// Rows: [relationId, multiLineCoordinates, [west,south,east,north]]\nexport default Object.freeze(${JSON.stringify(chunk)});\n`;
  await writeFile(path, content, 'utf8');
}

console.log(`Generated ${shapes.length} route shapes for ${relationIds.length} known OSM variants.`);
if (shapes.length !== relationIds.length) {
  const present = new Set(shapes.map((row) => row[0]));
  const missing = relationIds.filter((id) => !present.has(id));
  console.warn(`Missing geometry for ${missing.length} relation(s): ${missing.join(', ')}`);
}
