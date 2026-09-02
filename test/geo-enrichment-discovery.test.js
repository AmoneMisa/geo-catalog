import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildDiscoveryQuery,
  buildRouteFeature,
  classifyDiscovery,
  discoveryRadiusM,
  selectCityBoundary,
} from '../scripts/geo-enrichment-discovery.js';

test('bootstrap radius is conservative when no city polygon exists', () => {
  assert.equal(discoveryRadiusM({ accuracyM: 3000 }), 9000);
  assert.equal(discoveryRadiusM({ accuracyM: 1000 }), 6000);
  assert.equal(discoveryRadiusM({ accuracyM: 8000 }), 12000);
  assert.equal(discoveryRadiusM({}), 8000);
});

test('city boundary selection prefers the containing city over hromada and raion', () => {
  const center = { lat: 48.5894, lng: 38.0021 };
  const relation = selectCityBoundary('Bakhmut', center, [
    {
      type: 'relation', id: 11970387, center: { lat: 48.6135584, lon: 38.074075 },
      tags: { boundary: 'administrative', place: 'district', admin_level: '6', name: 'Бахмутський район', 'name:en': 'Bakhmut Raion' },
    },
    {
      type: 'relation', id: 13630428, center: { lat: 48.5714719, lon: 38.0679265 },
      tags: { boundary: 'administrative', place: 'municipality', admin_level: '7', name: 'Бахмутська міська громада' },
    },
    {
      type: 'relation', id: 3313703, center: { lat: 48.600763, lon: 38.0115337 },
      tags: { boundary: 'administrative', place: 'town', admin_level: '10', name: 'Бахмут', 'name:en': 'Bakhmut' },
    },
  ]);

  assert.equal(relation?.id, 3313703);
});

test('area-scoped query includes neighborhoods, residential landuse and streets', () => {
  const query = buildDiscoveryQuery({ mode: 'area', relationId: 3313703 });
  assert.match(query, /map_to_area/);
  assert.match(query, /landuse/);
  assert.match(query, /highway/);
  assert.match(query, /boundary/);
  assert.doesNotMatch(query, /around:24000/);
});

test('radius fallback does not discover broad administrative boundaries', () => {
  const query = buildDiscoveryQuery({ mode: 'radius', center: { lat: 50.33567, lng: 30.28476 }, radiusM: 9000 });
  assert.match(query, /around:9000/);
  assert.doesNotMatch(query, /\["boundary"="administrative"\]/);
});

test('discovery classifier retains streets and typed residential complexes', () => {
  assert.equal(classifyDiscovery({ type: 'way', id: 1, tags: { name: 'вулиця Короленка', highway: 'secondary' } }), 'street');
  assert.equal(classifyDiscovery({ type: 'way', id: 2, tags: { name: 'ЖК Central Park', landuse: 'residential' } }), 'residential_complex');
  assert.equal(classifyDiscovery({ type: 'way', id: 3, tags: { name: 'Будьонівка', place: 'neighbourhood', landuse: 'residential' } }), 'local_area');
  assert.equal(classifyDiscovery({ type: 'relation', id: 4, tags: { name: 'Village', place: 'village', boundary: 'administrative' } }), 'settlement');
  assert.equal(classifyDiscovery({ type: 'relation', id: 3313703, tags: { name: 'Bakhmut', boundary: 'administrative' } }, { relationId: 3313703 }), null);
});

test('discovery query surfaces POIs and transit stops/routes with full geometry', () => {
  const query = buildDiscoveryQuery({ mode: 'radius', center: { lat: 50, lng: 30 }, radiusM: 9000 });
  assert.match(query, /amenity/);
  assert.match(query, /public_transport/);
  assert.match(query, /"type"="route"/);
  assert.match(query, /out geom;$/);
});

test('buildRouteFeature stitches out-of-order way members into one ordered polyline and collects stops', () => {
  const relation = {
    type: 'relation',
    id: 99,
    tags: { type: 'route', route: 'bus', name: 'Route 5' },
    members: [
      { type: 'way', ref: 2, role: '', geometry: [{ lat: 0, lon: 2 }, { lat: 0, lon: 1 }] },
      { type: 'way', ref: 1, role: '', geometry: [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }] },
      { type: 'node', ref: 10, role: 'stop', lat: 0, lon: 0 },
      { type: 'node', ref: 11, role: 'stop', lat: 0, lon: 2 },
    ],
  };

  const feature = buildRouteFeature(relation);
  assert.equal(feature.geometry.length, 3);
  const lngs = feature.geometry.map((p) => p.lng).sort((a, b) => a - b);
  assert.deepEqual(lngs, [0, 1, 2]);
  assert.equal(feature.stops.length, 2);
  assert.deepEqual(feature.stops.map((s) => s.lng).sort((a, b) => a - b), [0, 2]);
  assert.ok(feature.point.lng > 0 && feature.point.lng < 2, 'route midpoint should sit along the assembled line');
});
