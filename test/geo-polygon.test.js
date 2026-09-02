import test from 'node:test';
import assert from 'node:assert/strict';

import { assembleRings, lineMidpoint, polygonPointOnSurface } from '../scripts/geo-polygon.js';

function pointInRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i].lng;
    const yi = ring[i].lat;
    const xj = ring[j].lng;
    const yj = ring[j].lat;
    const intersects = ((yi > point.lat) !== (yj > point.lat))
      && (point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

test('point on surface stays inside a square (sanity check)', () => {
  const ring = [{ lat: 0, lng: 0 }, { lat: 0, lng: 4 }, { lat: 4, lng: 4 }, { lat: 4, lng: 0 }];
  const point = polygonPointOnSurface({ outer: [ring] });
  assert.equal(pointInRing(point, ring), true);
  assert.deepEqual(point, { lat: 2, lng: 2 });
});

test('point on surface falls back off the area centroid for a U-shaped boundary', () => {
  // U-shaped ring (two legs plus a bottom bar) whose bbox center sits in the empty notch.
  const ring = [
    { lat: 0, lng: 0 }, { lat: 0, lng: 10 }, { lat: 10, lng: 10 }, { lat: 10, lng: 8 },
    { lat: 2, lng: 8 }, { lat: 2, lng: 2 }, { lat: 10, lng: 2 }, { lat: 10, lng: 0 },
  ];
  const bboxCenter = { lat: 5, lng: 5 };
  assert.equal(pointInRing(bboxCenter, ring), false, 'sanity check: bbox center must be outside the U shape');

  const point = polygonPointOnSurface({ outer: [ring] });
  assert.equal(pointInRing(point, ring), true);
});

test('point on surface subtracts holes (donut boundary)', () => {
  const outer = [{ lat: 0, lng: 0 }, { lat: 0, lng: 10 }, { lat: 10, lng: 10 }, { lat: 10, lng: 0 }];
  const hole = [{ lat: 3, lng: 3 }, { lat: 3, lng: 7 }, { lat: 7, lng: 7 }, { lat: 7, lng: 3 }];
  const point = polygonPointOnSurface({ outer: [outer], inner: [hole] });
  assert.equal(pointInRing(point, outer), true);
  assert.equal(pointInRing(point, hole), false);
});

test('point on surface picks the larger ring when a relation has exclaves', () => {
  const big = [{ lat: 0, lng: 0 }, { lat: 0, lng: 10 }, { lat: 10, lng: 10 }, { lat: 10, lng: 0 }];
  const small = [{ lat: 20, lng: 20 }, { lat: 20, lng: 21 }, { lat: 21, lng: 21 }, { lat: 21, lng: 20 }];
  const point = polygonPointOnSurface({ outer: [small, big] });
  assert.equal(pointInRing(point, big), true);
});

test('line midpoint returns the arc-length midpoint, not the index midpoint', () => {
  const coords = [{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }, { lat: 0, lng: 9 }];
  const mid = lineMidpoint(coords);
  assert.ok(Math.abs(mid.lng - 4.5) < 0.05);
  assert.equal(mid.lat, 0);
});

test('line midpoint handles a single point', () => {
  assert.deepEqual(lineMidpoint([{ lat: 1, lng: 2 }]), { lat: 1, lng: 2 });
});

test('assembleRings stitches out-of-order, reversed way segments into a closed ring', () => {
  const segments = [
    [{ lat: 1, lng: 1 }, { lat: 1, lng: 0 }],
    [{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }],
    [{ lat: 1, lng: 0 }, { lat: 0, lng: 0 }],
    [{ lat: 0, lng: 1 }, { lat: 1, lng: 1 }],
  ];
  const rings = assembleRings(segments);
  assert.equal(rings.length, 1);
  assert.equal(rings[0][0].lat, rings[0][rings[0].length - 1].lat);
  assert.equal(rings[0][0].lng, rings[0][rings[0].length - 1].lng);
});

test('assembleRings keeps unrelated segments as separate pieces', () => {
  const segments = [
    [{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }],
    [{ lat: 50, lng: 50 }, { lat: 51, lng: 51 }],
  ];
  const rings = assembleRings(segments);
  assert.equal(rings.length, 2);
});
