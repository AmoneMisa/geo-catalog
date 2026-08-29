import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

test('Navoiy 17 microdistrict has verified OSM spatial coverage', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:navoiy:microdistrict:17');

  assert.ok(entity);
  assert.equal(entity.canonicalName, '17 microdistrict');
  assert.equal(entity.parentId, 'uz:navoiy');
  assert.deepEqual(entity.center, { lat: 40.11312, lng: 65.3788 });
  assert.equal(entity.source, 'osm');
  assert.deepEqual(entity.osm, { type: 'node', id: 10734160833 });

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Navoiy',
    type: 'microdistrict',
    canonical: '17 microdistrict',
  });
  assert.equal(resolved?.id, entity.id);
});
