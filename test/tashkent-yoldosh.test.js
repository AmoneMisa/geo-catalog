import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

const expected = Object.freeze([
  ["Yo'ldosh-1", 'yoldosh-1', 'relation', 1866494],
  ["Yo'ldosh-2", 'yoldosh-2', 'relation', 1866492],
  ["Yo'ldosh-3", 'yoldosh-3', 'relation', 1959145],
  ["Yo'ldosh-4", 'yoldosh-4', 'node', 1868248384],
  ["Yo'ldosh-5", 'yoldosh-5', 'relation', 1959147],
  ["Yo'ldosh-6", 'yoldosh-6', 'relation', 1959148],
  ["Yo'ldosh-7", 'yoldosh-7', 'relation', 1959350],
  ["Yo'ldosh-8", 'yoldosh-8', 'relation', 1866493],
  ["Yo'ldosh-9", 'yoldosh-9', 'relation', 1866495],
  ["Yo'ldosh-10", 'yoldosh-10', 'relation', 1959342],
  ["Yo'ldosh-11", 'yoldosh-11', 'relation', 1959343],
  ["Yo'ldosh-12", 'yoldosh-12', 'relation', 1959344],
  ["Yo'ldosh-13", 'yoldosh-13', 'relation', 1959345],
  ["Yo'ldosh-14", 'yoldosh-14', 'relation', 1959346],
  ["Yo'ldosh-15", 'yoldosh-15', 'node', 13241688708],
  ["Yo'ldosh-16", 'yoldosh-16', 'way', 169301465],
  ["Yo'ldosh-16A", 'yoldosh-16a', 'node', 13241688680],
  ["Yo'ldosh-17", 'yoldosh-17', 'way', 169301466],
  ["Yo'ldosh-C1", 'yoldosh-c1', 'relation', 1959347],
  ["Yo'ldosh-C2", 'yoldosh-c2', 'relation', 1959348],
  ["Yo'ldosh-C3", 'yoldosh-c3', 'relation', 1959349],
]);

test('Tashkent Yoldosh/Sputnik dahas use direct Yangihayot OSM owners', () => {
  for (const [canonicalName, slug, osmType, osmId] of expected) {
    const entity = getGeoEntity(`uz:tashkent:local-area:${slug}`);
    assert.ok(entity, canonicalName);
    assert.equal(entity.canonicalName, canonicalName, canonicalName);
    assert.equal(entity.parentId, 'uz:tashkent:yangihayot', canonicalName);
    assert.equal(entity.type, 'local_area', canonicalName);
    assert.equal(entity.source, 'osm', canonicalName);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, canonicalName);
    assert.ok(Number.isFinite(entity.center?.lat), canonicalName);
    assert.ok(Number.isFinite(entity.center?.lng), canonicalName);
  }
});
