import { writeFile } from 'node:fs/promises';
import variantRows1 from '../src/transport/generated/tashkent-bus-osm-variants-1.js';
import variantRows2 from '../src/transport/generated/tashkent-bus-osm-variants-2.js';
import variantRows3 from '../src/transport/generated/tashkent-bus-osm-variants-3.js';

const OVERPASS_URLS = (process.env.OVERPASS_URLS || [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
].join(',')).split(',').map((value) => value.trim()).filter(Boolean);
const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const SOURCE_DATE = new Date().toISOString().slice(0, 10);
const BATCH_SIZE = 6;
const OUTPUT_PARTS = 3;
const MAX_ATTEMPTS_PER_ENDPOINT = 2;

const variantRows = [...variantRows1, ...variantRows2, ...variantRows3];
const relationIds = [...new Set(variantRows.map((row) => row[1]))].sort((a, b) => a - b);

const round6 = (value) => Math.round(value * 1e6) / 1e6;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function memberGeometry(member) {
  if (member?.type !== 'way' || !Array.isArray(member.geometry) || member.geometry.length < 2) return null;
  if (member.role === 'platform' || member.role === 'stop' || member.role === 'platform_entry_only' || member.role === 'platform_exit_only') return null;

  const coordinates = member.geometry
    .filter((point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lon))
    .map((point) => [round6(point.lon), round6(point.lat)]);

  return coordinates.length >= 2 ? coordinates : null;
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

async function fetchFromEndpoint(endpoint, ids, attempt) {
  const query = `[out:json][timeout:120];rel(id:${ids.join(',')});out geom;`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 150_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'user-agent': '@whiteslove/geo-catalog transport refresh',
      },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = (await response.text()).replace(/\s+/g, ' ').slice(0, 300);
      throw new Error(`${response.status} ${body}`);
    }

    const payload = await response.json();
    return (payload.elements || []).filter((element) => element.type === 'relation');
  } catch (error) {
    throw new Error(`${endpoint} attempt ${attempt}: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRelationFromOsmApi(relationId) {
  const response = await fetch(`${OSM_API_URL}/relation/${relationId}/full.json`, {
    headers: {
      accept: 'application/json',
      'user-agent': '@whiteslove/geo-catalog transport refresh',
    },
  });
  if (!response.ok) throw new Error(`OSM API ${response.status}`);

  const payload = await response.json();
  const elements = payload.elements || [];
  const relation = elements.find((element) => element.type === 'relation' && element.id === relationId);
  if (!relation) throw new Error('relation missing from OSM full response');

  const nodes = new Map(
    elements
      .filter((element) => element.type === 'node' && Number.isFinite(element.lat) && Number.isFinite(element.lon))
      .map((node) => [node.id, { lat: node.lat, lon: node.lon }]),
  );
  const ways = new Map(
    elements
      .filter((element) => element.type === 'way')
      .map((way) => [way.id, way]),
  );

  return {
    ...relation,
    members: (relation.members || []).map((member) => {
      if (member.type !== 'way') return member;
      const way = ways.get(member.ref);
      if (!way?.nodes?.length) return member;
      const geometry = way.nodes.map((nodeId) => nodes.get(nodeId)).filter(Boolean);
      return { ...member, geometry };
    }),
  };
}

async function fetchRelations(ids) {
  const failures = [];
  for (const endpoint of OVERPASS_URLS) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_ENDPOINT; attempt += 1) {
      try {
        return await fetchFromEndpoint(endpoint, ids, attempt);
      } catch (error) {
        failures.push(error.message);
        console.warn(error.message);
        await sleep(1_500 * attempt);
      }
    }
  }

  console.warn(`Overpass exhausted for ${ids.join(', ')}; falling back to OSM API /full.json.`);
  const relations = [];
  for (const id of ids) {
    try {
      relations.push(await fetchRelationFromOsmApi(id));
    } catch (error) {
      failures.push(`OSM API relation ${id}: ${error.message}`);
      console.warn(`OSM API relation ${id}: ${error.message}`);
    }
    await sleep(250);
  }

  if (!relations.length) {
    throw new Error(`All spatial sources failed for relations ${ids.join(', ')}: ${failures.join(' | ')}`);
  }
  return relations;
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
  await sleep(350);
}

shapes.sort((a, b) => a[0] - b[0]);

const chunkSize = Math.ceil(shapes.length / OUTPUT_PARTS);
for (let part = 0; part < OUTPUT_PARTS; part += 1) {
  const chunk = shapes.slice(part * chunkSize, (part + 1) * chunkSize);
  const path = new URL(`../src/transport/generated/tashkent-bus-osm-shapes-${part + 1}.js`, import.meta.url);
  const content = `// Generated from OpenStreetMap ${SOURCE_DATE}; ODbL.\n// Rows: [relationId, multiLineCoordinates, [west,south,east,north]]\nexport default Object.freeze(${JSON.stringify(chunk)});\n`;
  await writeFile(path, content, 'utf8');
}

console.log(`Generated ${shapes.length} route shapes for ${relationIds.length} known OSM variants.`);
if (shapes.length !== relationIds.length) {
  const present = new Set(shapes.map((row) => row[0]));
  const missing = relationIds.filter((id) => !present.has(id));
  console.warn(`Missing geometry for ${missing.length} relation(s): ${missing.join(', ')}`);
}
