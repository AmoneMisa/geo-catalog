import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['Amir Temur Street', { lat: 41.010864, lng: 70.058935 }, 1000],
  ['Bunyodkor Street', { lat: 41.007714, lng: 70.074826 }, 900],
  ['Ohangaron Street', { lat: 41.009918, lng: 70.097087 }, 1100],
]);

test('Angren streets use conservative representative street centers', () => {
  for (const [canonical, center, accuracyM] of expected) {
    const entity = resolveLexiconGeoEntity({
      country: 'UZ',
      city: 'Angren',
      type: 'street',
      canonical,
    });

    assert.ok(entity, canonical);
    assert.equal(entity.canonicalName, canonical);
    assert.equal(entity.parentId, 'uz:angren');
    assert.deepEqual(entity.center, center);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.accuracy, 'street');
    assert.equal(entity.accuracyM, accuracyM);
    assert.equal(entity.osm, undefined);
  }
});
