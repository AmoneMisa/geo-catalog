import { writeFile } from 'node:fs/promises';

const OSM_API_URL = process.env.OSM_API_URL || 'https://api.openstreetmap.org/api/0.6';
const SOURCE_DATE = new Date().toISOString().slice(0, 10);

const LINES = Object.freeze([
  ['chilonzor', 2507927],
  ['ozbekiston', 2507796],
  ['yunusobod', 2507797],
  ['circle', 14074756],
]);

const round6 = (value) => Math.round(value * 1e6) / 1e6;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRelation(relationId) {
  const response = await fetch(`${OSM_API_URL}/relation/${relationId}/full.json`, {
    headers: {
      accept: 'application/json',
      'user-agent': '@whiteslove/geo-catalog transport refresh',
    },
  });
  if (!response.ok) throw new Error(`OSM API ${response.status} for relation ${relationId}`);

  const payload = await response.json();
  const elements = payload.elements || [];
  const relation = elements.find((element) => element.type === 'relation' && element.id === relationId);
  if (!relation) throw new Error(`Relation ${relationId} missing from OSM full response.`);

  const nodes = new Map(
    elements
      .filter((element) => element.type === 'node' && Number.isFinite(element.lat) && Number.isFinite(element.lon))
      .map((node) => [node.id, [round6(node.lon), round6(node.lat)]]),
  );
  const ways = new Map(elements.filter((element) => element.type === 'way').map((way) => [way.id, way]));

  const segments = [];
  for (const member of relation.members || []) {
    if (member.type !== 'way') continue;
    if (['platform', 'stop', 'platform_entry_only', 'platform_exit_only'].includes(member.role)) continue;
    const way = ways.get(member.ref);
    if (!way?.nodes?.length) continue;
    const coordinates = way.nodes.map((nodeId) => nodes.get(nodeId)).filter(Boolean);
    if (coordinates.length >= 2) segments.push(coordinates);
  }

  if (!segments.length) throw new Error(`Relation ${relationId} contains no drawable way geometry.`);

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

  return [relationId, segments, [west, south, east, north]];
}

const rows = [];
for (const [slug, relationId] of LINES) {
  console.log(`Fetching ${slug} metro relation ${relationId}`);
  const [, segments, bounds] = await fetchRelation(relationId);
  rows.push([slug, relationId, segments, bounds]);
  await sleep(350);
}

const path = new URL('../src/transport/generated/tashkent-metro-osm-shapes.js', import.meta.url);
const content = `// Generated from OpenStreetMap ${SOURCE_DATE}; ODbL.\n// Rows: [lineSlug, relationId, multiLineCoordinates, [west,south,east,north]]\nexport default Object.freeze(${JSON.stringify(rows)});\n`;
await writeFile(path, content, 'utf8');
console.log(`Generated ${rows.length} Tashkent metro line shapes.`);
