#!/usr/bin/env node
/**
 * Offline, dependency-free importer for the useful named OSM POI subset in a
 * Geofabrik .osm.pbf extract.  It deliberately produces GeoJSON-like features
 * for the catalog's existing normalizer rather than placing raw OSM data in
 * the runtime package.
 *
 * Usage:
 *   node scripts/import-geofabrik-pbf.js --input country.osm.pbf --country UZ \
 *     --city Tashkent --parent-id uz:tashkent --bbox 41.15,69.12,41.43,69.53 \
 *     --boundary-relation 2216724 --boundary-name Tashkent \
 *     --output .cache/geo-enrichment/uz-tashkent-poi.json
 */
import { open, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { inflateSync } from 'node:zlib';

import { osmPoiCategory } from '../src/osm-poi-import.js';

const MAX_BLOB_HEADER_BYTES = 64 * 1024;
const NANO_DEGREES = 1e-9;

function fail(message) {
  throw new Error(`Geofabrik PBF import: ${message}`);
}

function readVarint(buffer, offset) {
  let value = 0;
  let multiplier = 1;
  let cursor = offset;
  while (cursor < buffer.length) {
    const byte = buffer[cursor++];
    value += (byte & 0x7f) * multiplier;
    if ((byte & 0x80) === 0) return [value, cursor];
    multiplier *= 128;
    if (multiplier > Number.MAX_SAFE_INTEGER / 128) fail('encountered an unsupported 64-bit varint');
  }
  fail('truncated varint');
}

function decodeZigZag(value) {
  return value % 2 ? -(value + 1) / 2 : value / 2;
}

function readFields(buffer, visit) {
  let offset = 0;
  while (offset < buffer.length) {
    const [key, afterKey] = readVarint(buffer, offset);
    offset = afterKey;
    const field = Math.floor(key / 8);
    const wire = key % 8;
    if (wire === 0) {
      const [value, afterValue] = readVarint(buffer, offset);
      visit(field, wire, value);
      offset = afterValue;
    } else if (wire === 1) {
      if (offset + 8 > buffer.length) fail('truncated fixed64 field');
      visit(field, wire, buffer.subarray(offset, offset + 8));
      offset += 8;
    } else if (wire === 2) {
      const [length, afterLength] = readVarint(buffer, offset);
      offset = afterLength;
      if (offset + length > buffer.length) fail('truncated length-delimited field');
      visit(field, wire, buffer.subarray(offset, offset + length));
      offset += length;
    } else if (wire === 5) {
      if (offset + 4 > buffer.length) fail('truncated fixed32 field');
      visit(field, wire, buffer.subarray(offset, offset + 4));
      offset += 4;
    } else {
      fail(`unsupported protobuf wire type ${wire}`);
    }
  }
}

function packedVarints(buffer, { zigZag = false } = {}) {
  const values = [];
  let offset = 0;
  while (offset < buffer.length) {
    const [value, next] = readVarint(buffer, offset);
    values.push(zigZag ? decodeZigZag(value) : value);
    offset = next;
  }
  return values;
}

function tagsFromIndexes(keys, values, strings) {
  const tags = {};
  for (let index = 0; index < Math.min(keys.length, values.length); index++) {
    const key = strings[keys[index]];
    const value = strings[values[index]];
    if (key && value) tags[key] = value;
  }
  return tags;
}

function parseNode(message, block) {
  let id;
  let lat;
  let lon;
  const keys = [];
  const values = [];
  readFields(message, (field, wire, value) => {
    if (field === 1 && wire === 0) id = decodeZigZag(value);
    if (field === 8 && wire === 0) lat = decodeZigZag(value);
    if (field === 9 && wire === 0) lon = decodeZigZag(value);
    if (field === 10 && wire === 2) keys.push(...packedVarints(value));
    if (field === 11 && wire === 2) values.push(...packedVarints(value));
  });
  if (!Number.isSafeInteger(id) || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    id,
    center: {
      lat: NANO_DEGREES * (block.latOffset + block.granularity * lat),
      lng: NANO_DEGREES * (block.lonOffset + block.granularity * lon),
    },
    tags: tagsFromIndexes(keys, values, block.strings),
  };
}

function parseDenseNodes(message, block, visit) {
  const fields = new Map();
  readFields(message, (field, wire, value) => {
    if (wire === 2) fields.set(field, value);
  });
  const ids = packedVarints(fields.get(1) || Buffer.alloc(0), { zigZag: true });
  const lats = packedVarints(fields.get(8) || Buffer.alloc(0), { zigZag: true });
  const lons = packedVarints(fields.get(9) || Buffer.alloc(0), { zigZag: true });
  const keyValues = packedVarints(fields.get(10) || Buffer.alloc(0));
  let id = 0;
  let lat = 0;
  let lon = 0;
  let tagCursor = 0;
  for (let index = 0; index < Math.min(ids.length, lats.length, lons.length); index++) {
    id += ids[index];
    lat += lats[index];
    lon += lons[index];
    const keys = [];
    const values = [];
    while (tagCursor < keyValues.length && keyValues[tagCursor] !== 0) {
      keys.push(keyValues[tagCursor++]);
      values.push(keyValues[tagCursor++]);
    }
    tagCursor += 1;
    visit({
      id,
      center: {
        lat: NANO_DEGREES * (block.latOffset + block.granularity * lat),
        lng: NANO_DEGREES * (block.lonOffset + block.granularity * lon),
      },
      tags: tagsFromIndexes(keys, values, block.strings),
    });
  }
}

function parseWay(message, strings) {
  let id;
  const keys = [];
  const values = [];
  const refs = [];
  readFields(message, (field, wire, value) => {
    // Way.id is int64 in the OSM PBF schema. Node IDs use sint64, but applying
    // zigzag here turns every positive way ID into a negative catalog ID.
    if (field === 1 && wire === 0) id = value;
    if (field === 2 && wire === 2) keys.push(...packedVarints(value));
    if (field === 3 && wire === 2) values.push(...packedVarints(value));
    if (field === 8 && wire === 2) refs.push(...packedVarints(value, { zigZag: true }));
  });
  if (!Number.isSafeInteger(id)) return null;
  let ref = 0;
  return { id, refs: refs.map((delta) => (ref += delta)), tags: tagsFromIndexes(keys, values, strings) };
}

function parseRelation(message, strings) {
  let id;
  const keys = [];
  const values = [];
  const roles = [];
  const memberIds = [];
  const memberTypes = [];
  readFields(message, (field, wire, value) => {
    if (field === 1 && wire === 0) id = value;
    if (field === 2 && wire === 2) keys.push(...packedVarints(value));
    if (field === 3 && wire === 2) values.push(...packedVarints(value));
    if (field === 8 && wire === 2) roles.push(...packedVarints(value));
    if (field === 9 && wire === 2) memberIds.push(...packedVarints(value, { zigZag: true }));
    if (field === 10 && wire === 2) memberTypes.push(...packedVarints(value));
  });
  if (!Number.isSafeInteger(id)) return null;
  let memberId = 0;
  return {
    id,
    tags: tagsFromIndexes(keys, values, strings),
    members: memberIds.map((delta, index) => {
      memberId += delta;
      return { id: memberId, type: memberTypes[index], role: strings[roles[index]] || '' };
    }),
  };
}

function parsePrimitiveBlock(message, visitor) {
  const strings = [];
  const groups = [];
  let granularity = 100;
  let latOffset = 0;
  let lonOffset = 0;
  readFields(message, (field, wire, value) => {
    if (field === 1 && wire === 2) readFields(value, (stringField, stringWire, stringValue) => {
      if (stringField === 1 && stringWire === 2) strings.push(stringValue.toString('utf8'));
    });
    if (field === 2 && wire === 2) groups.push(value);
    if (field === 17 && wire === 0) granularity = value;
    if (field === 19 && wire === 0) latOffset = decodeZigZag(value);
    if (field === 20 && wire === 0) lonOffset = decodeZigZag(value);
  });
  const block = { strings, granularity, latOffset, lonOffset };
  for (const group of groups) {
    readFields(group, (field, wire, value) => {
      if (field === 1 && wire === 2) {
        const node = parseNode(value, block);
        if (node) visitor.node(node);
      }
      if (field === 2 && wire === 2) parseDenseNodes(value, block, visitor.node);
      if (field === 3 && wire === 2) {
        const way = parseWay(value, strings);
        if (way) visitor.way(way);
      }
      if (field === 4 && wire === 2) {
        const relation = parseRelation(value, strings);
        if (relation && visitor.relation) visitor.relation(relation);
      }
    });
  }
}

async function eachPbfBlock(path, visit) {
  const handle = await open(path, 'r');
  try {
    let offset = 0;
    const headerSize = Buffer.alloc(4);
    while (true) {
      const { bytesRead } = await handle.read(headerSize, 0, 4, offset);
      if (bytesRead === 0) return;
      if (bytesRead !== 4) fail('truncated block-length prefix');
      offset += 4;
      const headerLength = headerSize.readUInt32BE();
      if (headerLength <= 0 || headerLength > MAX_BLOB_HEADER_BYTES) fail(`invalid blob header size ${headerLength}`);
      const header = Buffer.alloc(headerLength);
      await handle.read(header, 0, headerLength, offset);
      offset += headerLength;
      let type = '';
      let dataSize = 0;
      readFields(header, (field, wire, value) => {
        if (field === 1 && wire === 2) type = value.toString('utf8');
        if (field === 3 && wire === 0) dataSize = value;
      });
      if (!dataSize || dataSize > 64 * 1024 * 1024) fail(`invalid blob size ${dataSize}`);
      const blob = Buffer.alloc(dataSize);
      await handle.read(blob, 0, dataSize, offset);
      offset += dataSize;
      let raw = null;
      let compressed = null;
      readFields(blob, (field, wire, value) => {
        if (field === 1 && wire === 2) raw = value;
        if (field === 3 && wire === 2) compressed = value;
      });
      const payload = raw || (compressed ? inflateSync(compressed) : null);
      if (!payload) fail('encountered an unsupported non-zlib PBF blob');
      if (type === 'OSMData') visit(payload);
    }
  } finally {
    await handle.close();
  }
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith('--') || !value) fail('expected --input --country --city --parent-id --bbox and --output');
    values[key.slice(2)] = value;
  }
  const bbox = String(values.bbox || '').split(',').map(Number);
  const boundaryRelation = values['boundary-relation'] === undefined ? null : Number(values['boundary-relation']);
  const boundaryName = values['boundary-name']?.trim() || null;
  if (!values.input || !/^[A-Z]{2}$/i.test(values.country || '') || !values.city || !values['parent-id'] || !values.output || bbox.length !== 4 || bbox.some((value) => !Number.isFinite(value)) || (boundaryRelation !== null && (!Number.isInteger(boundaryRelation) || boundaryRelation <= 0))) {
    fail('invalid arguments');
  }
  return { ...values, country: values.country.toUpperCase(), boundaryName, boundaryRelation, bbox: { south: bbox[0], west: bbox[1], north: bbox[2], east: bbox[3] } };
}

function insideBbox(center, bbox) {
  return center.lat >= bbox.south && center.lat <= bbox.north && center.lng >= bbox.west && center.lng <= bbox.east;
}

function normalizedName(value) {
  return String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ');
}

function relationHasBoundaryName(relation, requestedName) {
  // Regions often carry a translated short name identical to their capital.
  // A city-bound POI import must require the OSM city-place marker as well.
  // Some well-mapped city extents (for example Odesa) are a place=city
  // multipolygon rather than an administrative boundary relation. Both are
  // valid closed city areas; retaining the city marker keeps region aliases
  // and arbitrary same-name POIs out of the import scope.
  if (!requestedName || relation.tags.place !== 'city'
    || !['administrative', 'multipolygon'].includes(relation.tags.boundary || relation.tags.type)) return false;
  const wanted = normalizedName(requestedName);
  return Object.entries(relation.tags)
    .filter(([key]) => key === 'name' || key.startsWith('name:') || key === 'official_name')
    .some(([, value]) => normalizedName(value) === wanted);
}

function stitchRings(segments) {
  const pending = segments.filter((segment) => segment.length > 1).map((segment) => [...segment]);
  const rings = [];
  while (pending.length) {
    const ring = pending.pop();
    let joined = true;
    while (joined && ring[0] !== ring.at(-1)) {
      joined = false;
      const first = ring[0];
      const last = ring.at(-1);
      const index = pending.findIndex((segment) => segment[0] === last || segment.at(-1) === last || segment[0] === first || segment.at(-1) === first);
      if (index < 0) continue;
      const segment = pending.splice(index, 1)[0];
      if (segment[0] === last) ring.push(...segment.slice(1));
      else if (segment.at(-1) === last) ring.push(...segment.toReversed().slice(1));
      else if (segment.at(-1) === first) ring.unshift(...segment.slice(0, -1));
      else ring.unshift(...segment.toReversed().slice(0, -1));
      joined = true;
    }
    if (ring.length >= 4 && ring[0] === ring.at(-1)) rings.push(ring);
  }
  return rings;
}

function pointInRing(center, ring, nodes) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const a = nodes.get(ring[index]);
    const b = nodes.get(ring[previous]);
    if (!a || !b) continue;
    const intersects = (a.lat > center.lat) !== (b.lat > center.lat)
      && center.lng < (b.lng - a.lng) * (center.lat - a.lat) / (b.lat - a.lat) + a.lng;
    if (intersects) inside = !inside;
  }
  return inside;
}

function feature(osmType, osmId, tags, center) {
  return { properties: { osm_type: osmType, osm_id: osmId, tags }, geometry: { type: 'Point', coordinates: [center.lng, center.lat] } };
}

const args = parseArgs(process.argv.slice(2));
const nodeFeatures = [];
const ways = [];
const wantedNodeIds = new Set();
const boundaryWayRoles = new Map();
let resolvedBoundaryRelation = args.boundaryRelation;
await eachPbfBlock(args.input, (payload) => parsePrimitiveBlock(payload, {
  node(node) {
    if (insideBbox(node.center, args.bbox) && osmPoiCategory({ properties: { tags: node.tags } })) nodeFeatures.push(feature('node', node.id, node.tags, node.center));
  },
  way(way) {
    if (osmPoiCategory({ properties: { tags: way.tags } })) {
      ways.push(way);
      for (const ref of way.refs) wantedNodeIds.add(ref);
    }
  },
  relation(relation) {
    const explicitMatch = relation.id === args.boundaryRelation;
    const nameMatch = args.boundaryRelation === null && relationHasBoundaryName(relation, args.boundaryName);
    if (!explicitMatch && !nameMatch) return;
    if (resolvedBoundaryRelation !== null && resolvedBoundaryRelation !== relation.id) fail(`boundary name ${args.boundaryName} matches multiple relations (${resolvedBoundaryRelation}, ${relation.id})`);
    resolvedBoundaryRelation = relation.id;
    for (const member of relation.members) {
      if (member.type === 1 && ['outer', 'inner'].includes(member.role)) boundaryWayRoles.set(member.id, member.role);
    }
  },
}));

if ((args.boundaryRelation || args.boundaryName) && !boundaryWayRoles.size) {
  fail(`could not find outer/inner ways for requested city boundary${resolvedBoundaryRelation === null ? '' : ` (${resolvedBoundaryRelation})`}`);
}

const boundarySegments = { outer: [], inner: [] };
if (boundaryWayRoles.size) {
  await eachPbfBlock(args.input, (payload) => parsePrimitiveBlock(payload, {
    node() {},
    relation() {},
    way(way) {
      const role = boundaryWayRoles.get(way.id);
      if (!role) return;
      boundarySegments[role].push(way.refs);
      for (const ref of way.refs) wantedNodeIds.add(ref);
    },
  }));
}

const wayNodes = new Map();
await eachPbfBlock(args.input, (payload) => parsePrimitiveBlock(payload, {
  node(node) {
    if (wantedNodeIds.has(node.id)) wayNodes.set(node.id, node.center);
  },
  way() {},
  relation() {},
}));

const boundaryRings = {
  outer: stitchRings(boundarySegments.outer),
  inner: stitchRings(boundarySegments.inner),
};
if (resolvedBoundaryRelation && !boundaryRings.outer.length) fail(`could not assemble an outer ring for boundary relation ${resolvedBoundaryRelation}`);
const insideCity = (center) => insideBbox(center, args.bbox) && (!resolvedBoundaryRelation
  || (boundaryRings.outer.some((ring) => pointInRing(center, ring, wayNodes))
    && !boundaryRings.inner.some((ring) => pointInRing(center, ring, wayNodes))));

const wayFeatures = [];
for (const way of ways) {
  const points = way.refs.map((ref) => wayNodes.get(ref)).filter(Boolean);
  if (!points.length) continue;
  const center = points.reduce((total, point) => ({ lat: total.lat + point.lat, lng: total.lng + point.lng }), { lat: 0, lng: 0 });
  center.lat /= points.length;
  center.lng /= points.length;
  if (insideCity(center)) wayFeatures.push(feature('way', way.id, way.tags, center));
}

const output = [...nodeFeatures.filter((item) => insideCity({ lat: item.geometry.coordinates[1], lng: item.geometry.coordinates[0] })), ...wayFeatures]
  .sort((a, b) => `${a.properties.osm_type}:${a.properties.osm_id}`.localeCompare(`${b.properties.osm_type}:${b.properties.osm_id}`));
await mkdir(dirname(args.output), { recursive: true });
await writeFile(args.output, `${JSON.stringify({ type: 'FeatureCollection', features: output }, null, 2)}\n`);
console.log(`Wrote ${output.length} named POI features to ${args.output}${resolvedBoundaryRelation ? ` (boundary relation ${resolvedBoundaryRelation})` : ''}`);
