import test from 'node:test';
import assert from 'node:assert/strict';

import { TASHKENT_STREET_ADDRESS_ENTITIES } from '../src/data/uz/tashkent/streets-addresses.js';

const streets = TASHKENT_STREET_ADDRESS_ENTITIES.filter((entry) => entry.type === 'street');
const byName = new Map(streets.map((entry) => [entry.canonicalName, entry]));

test('Visit Tashkent gastronomic corridors resolve to physical street entities', () => {
  const expected = new Map([
    ['Mehrgiyo Street', [41.2220528, 69.2074789]],
    ['Al-Khwarizmi Street', [41.2749602, 69.1945793]],
    ['Dilsaroy Street', [41.3541403, 69.2328288]],
    ['Rihsili Street', [41.3673935, 69.2847905]],
    ['Chigatoy-Darvoza Street', [41.3372905, 69.2219824]],
    ['Gulkhaniy Street', [41.3011656, 69.2119554]],
    ['Farhod Street', [41.2851148, 69.1882192]],
    ['Sogdiyona Street', [41.220733, 69.2281374]],
  ]);

  for (const [name, [lat, lng]] of expected) {
    const entity = byName.get(name);
    assert.ok(entity, name);
    assert.equal(entity.type, 'street', name);
    assert.equal(entity.center.lat, lat, name);
    assert.equal(entity.center.lng, lng, name);
    assert.notEqual(entity.center.lat, 0, name);
    assert.notEqual(entity.center.lng, 0, name);
  }
});

test('existing Taras Shevchenko and Shota Rustaveli streets are reused, not duplicated', () => {
  for (const name of ['Taras Shevchenko Street', 'Shota Rustaveli Street']) {
    assert.equal(streets.filter((entry) => entry.canonicalName === name).length, 1, name);
  }
});

test('gastronomic corridors are not represented as duplicate POIs', () => {
  assert.equal(
    TASHKENT_STREET_ADDRESS_ENTITIES.some((entry) => /gastronomic/iu.test(entry.canonicalName)),
    false,
  );
});
