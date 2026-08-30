import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getTransportRoute,
  getTransportRouteGeoJSON,
} from '../src/transport/catalog.js';

const metroLines = Object.freeze([
  ['chilonzor', 2507927],
  ['ozbekiston', 2507796],
  ['yunusobod', 2507797],
  ['circle', 14074756],
]);

test('all Tashkent metro lines expose verified OSM map geometry', () => {
  for (const [slug, relationId] of metroLines) {
    const route = getTransportRoute(`uz:tashkent:route:metro:${slug}`);
    assert.equal(route?.geometry?.type, 'MultiLineString', slug);
    assert.ok(route.geometry.coordinates.length > 0, slug);
    assert.deepEqual(route.osm, { type: 'relation', id: relationId }, slug);
    assert.equal(route.geometrySource, 'osm', slug);
    assert.equal(route.geometryUpdatedAt, '2026-08-30', slug);
    assert.ok(route.bounds.west < route.bounds.east, slug);
    assert.ok(route.bounds.south < route.bounds.north, slug);
  }
});

test('metro route GeoJSON is directly renderable as one map feature', () => {
  const geojson = getTransportRouteGeoJSON('uz:tashkent:route:metro:chilonzor');
  assert.equal(geojson.type, 'FeatureCollection');
  assert.equal(geojson.features.length, 1);
  assert.equal(geojson.features[0].geometry.type, 'MultiLineString');
  assert.equal(geojson.features[0].properties.mode, 'metro');
  assert.equal(geojson.features[0].properties.osmRelationId, 2507927);
});
