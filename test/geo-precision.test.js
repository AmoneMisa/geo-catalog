import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEO_PRECISIONS, PRECISION_UNCERTAINTY_KM, createGeoPoint, geoPointForEntity,
  precisionForEntityType, coarsestPrecision, validateAgainstContainer, measuredDistanceKm,
} from '../src/geo-precision.js';

const point = (lat, lng, precision, extra = {}) => createGeoPoint({ lat, lng, precision, ...extra });

test('precisions are ordered most precise first', () => {
  assert.deepEqual([...GEO_PRECISIONS], ['rooftop', 'building', 'street', 'neighbourhood', 'district', 'city']);
  for (let i = 1; i < GEO_PRECISIONS.length; i += 1) {
    assert.ok(PRECISION_UNCERTAINTY_KM[GEO_PRECISIONS[i]] > PRECISION_UNCERTAINTY_KM[GEO_PRECISIONS[i - 1]], 'coarser precision must carry more uncertainty');
  }
});

test('a point carries its precision, uncertainty and source', () => {
  const built = point(41.3, 69.25, 'building', { source: 'osm', bbox: { north: 41.4, south: 41.2, east: 69.3, west: 69.2 } });
  assert.equal(built.precision, 'building');
  assert.equal(built.uncertaintyKm, PRECISION_UNCERTAINTY_KM.building);
  assert.equal(built.source, 'osm');
  assert.equal(built.bbox.north, 41.4);
});

test('a point rejects invalid coordinates and unknown precisions', () => {
  assert.throws(() => createGeoPoint({ lat: 200, lng: 0, precision: 'city' }), TypeError);
  assert.throws(() => createGeoPoint({ lat: 41, lng: 69, precision: 'exact' }), TypeError);
  assert.throws(() => createGeoPoint({ lat: 41, precision: 'city' }), TypeError);
});

test('uncertainty may be widened but never narrowed below the precision floor', () => {
  assert.equal(point(41, 69, 'city', { uncertaintyKm: 40 }).uncertaintyKm, 40);
  assert.equal(point(41, 69, 'city', { uncertaintyKm: 0.001 }).uncertaintyKm, PRECISION_UNCERTAINTY_KM.city,
    'six decimal places do not make a city centroid a rooftop fix');
});

test('entity types map to the precision their centroid can actually claim', () => {
  assert.equal(precisionForEntityType('city'), 'city');
  assert.equal(precisionForEntityType('district'), 'district');
  assert.equal(precisionForEntityType('mahalla'), 'neighbourhood');
  assert.equal(precisionForEntityType('street'), 'street');
  assert.equal(precisionForEntityType('metro'), 'building');
  assert.equal(precisionForEntityType('poi.market'), 'building', 'poi subtypes resolve like poi');
  assert.equal(precisionForEntityType('something-new'), 'district', 'an unknown type is assumed coarse, not precise');
});

test('a point can be built straight from a catalogue entity', () => {
  const built = geoPointForEntity({ type: 'metro', center: { lat: 41.3, lng: 69.25 } });
  assert.equal(built.precision, 'building');
  assert.equal(built.source, 'catalog');
  assert.equal(geoPointForEntity({ type: 'city' }), null, 'an entity with no centre yields no point');
});

test('a chain is only as precise as its weakest link', () => {
  assert.equal(coarsestPrecision('rooftop', 'city'), 'city');
  assert.equal(coarsestPrecision('street', 'building'), 'street');
  assert.equal(coarsestPrecision('rooftop'), 'rooftop');
  assert.equal(coarsestPrecision('nonsense'), null);
});

test('a point inside its container bbox is consistent', () => {
  const container = { center: { lat: 41.3, lng: 69.25 }, bbox: { north: 41.4, south: 41.2, east: 69.4, west: 69.1 }, type: 'district' };
  assert.equal(validateAgainstContainer(point(41.31, 69.26, 'building'), container).status, 'consistent');
});

test('a point just outside a bbox is uncertain, not an error', () => {
  const container = { center: { lat: 41.3, lng: 69.25 }, bbox: { north: 41.31, south: 41.29, east: 69.26, west: 69.24 }, type: 'district' };
  const result = validateAgainstContainer(point(41.315, 69.25, 'building'), container);
  assert.equal(result.status, 'uncertain', 'the edge of a coarse boundary is not evidence of an error');
});

test('a point far outside its container is inconsistent', () => {
  const container = { center: { lat: 41.3, lng: 69.25 }, bbox: { north: 41.4, south: 41.2, east: 69.4, west: 69.1 }, type: 'district' };
  const result = validateAgainstContainer(point(39.65, 66.95, 'building'), container);
  assert.equal(result.status, 'inconsistent', 'a Samarkand coordinate under a Tashkent district is worth acting on');
  assert.ok(result.km > 100);
});

test('a container without a bbox is judged by its own uncertainty', () => {
  const city = { center: { lat: 41.3, lng: 69.25 }, type: 'city' };
  assert.equal(validateAgainstContainer(point(41.35, 69.3, 'building'), city).status, 'consistent', 'well inside a city radius');
  assert.equal(validateAgainstContainer(point(39.65, 66.95, 'building'), city).status, 'inconsistent');
});

test('a coarse container tolerates more than a precise one', () => {
  const far = point(41.36, 69.25, 'building');
  const city = { center: { lat: 41.3, lng: 69.25 }, type: 'city' };
  const complex = { center: { lat: 41.3, lng: 69.25 }, type: 'residential_complex' };
  assert.equal(validateAgainstContainer(far, city).status, 'consistent');
  assert.equal(validateAgainstContainer(far, complex).status, 'inconsistent');
});

test('missing information reports unknown rather than guessing', () => {
  assert.equal(validateAgainstContainer(null, {}).status, 'unknown');
  assert.equal(validateAgainstContainer(point(41, 69, 'city'), null).status, 'unknown');
  assert.equal(validateAgainstContainer(point(41, 69, 'city'), { type: 'city' }).status, 'unknown', 'a container with no coordinate cannot judge anything');
});

test('a distance is reported with the margin it is good to', () => {
  const metro = point(41.3, 69.25, 'building');
  const flat = point(41.305, 69.25, 'building');
  const measured = measuredDistanceKm(metro, flat);
  assert.ok(measured.km > 0.5 && measured.km < 0.6);
  assert.equal(measured.precision, 'building');
  assert.equal(measured.meaningful, true);
});

test('a distance swamped by its own uncertainty is not meaningful', () => {
  // The failure this prevents: "200 m from the metro" computed from two city
  // centroids that could each be 15 km out.
  const cityA = point(41.3, 69.25, 'city');
  const cityB = point(41.302, 69.25, 'city');
  const measured = measuredDistanceKm(cityA, cityB);
  assert.equal(measured.meaningful, false);
  assert.equal(measured.precision, 'city');
  assert.ok(measured.marginKm > measured.km);
});

test('a precise point measured against a coarse one inherits the coarse precision', () => {
  const far = measuredDistanceKm(point(41.3, 69.25, 'rooftop'), point(41.5, 69.25, 'city'));
  assert.equal(far.precision, 'city', 'the rooftop fix does not make the pair precise');
  assert.ok(far.km > 20);
  assert.equal(far.meaningful, true, '22 km still clears a 15 km margin');

  // Closer than the margin, so the separation is not distinguishable from zero.
  const near = measuredDistanceKm(point(41.3, 69.25, 'rooftop'), point(41.32, 69.25, 'city'));
  assert.ok(near.km < near.marginKm);
  assert.equal(near.meaningful, false);
});

test('an unmeasurable pair returns null', () => {
  assert.equal(measuredDistanceKm({ lat: NaN, lng: 0 }, point(41, 69, 'city')), null);
});
