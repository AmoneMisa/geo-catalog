import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

test('Almalyk Kamalak mahalla uses a conservative derived representative center', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:almalyk:mahalla:kamalak');

  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Kamalak');
  assert.equal(entity.parentId, 'uz:almalyk');
  assert.deepEqual(entity.center, { lat: 40.85209, lng: 69.59927 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'approximate');
  assert.equal(entity.accuracyM, 900);

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Almalyk',
    type: 'mahalla',
    canonical: 'Kamalak',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Almalyk',
    type: 'mahalla',
    canonical: 'Kamalak',
  }), false);
});

test('verified Almalyk microdistricts keep distinct OSM identities', () => {
  const expected = new Map([
    ['5/1 microdistrict', ['uz:almalyk:microdistrict:5-1', 13265597237, 40.87259, 69.5972]],
    ['5/2 microdistrict', ['uz:almalyk:microdistrict:5-2', 13265620857, 40.86932, 69.60923]],
    ['5/3 microdistrict', ['uz:almalyk:microdistrict:5-3', 13265620858, 40.86545, 69.6002]],
    ['Yubileyny microdistrict', ['uz:almalyk:microdistrict:yubileyny', 13265620859, 40.86862, 69.6007]],
  ]);

  for (const [canonical, [id, osmId, lat, lng]] of expected) {
    const entity = GEO_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, canonical);
    assert.equal(entity.canonicalName, canonical);
    assert.equal(entity.parentId, 'uz:almalyk');
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'node', id: osmId });
    assert.deepEqual(entity.center, { lat, lng });

    const resolved = resolveLexiconGeoEntity({
      country: 'UZ',
      city: 'Almalyk',
      type: 'microdistrict',
      canonical,
    });
    assert.equal(resolved?.id, id, canonical);
  }
});
