import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

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

test('Navoiy Farhod Palace of Culture resolves to its verified OSM building', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:navoiy:poi:farhod-palace-of-culture');

  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Farhod Palace of Culture');
  assert.equal(entity.parentId, 'uz:navoiy');
  assert.deepEqual(entity.center, { lat: 40.09845, lng: 65.37636 });
  assert.equal(entity.source, 'osm');
  assert.deepEqual(entity.osm, { type: 'way', id: 146696792 });

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Navoiy',
    type: 'poi',
    canonical: 'Farhod Palace of Culture',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Navoiy',
    type: 'poi',
    canonical: 'Farhod Palace of Culture',
  }), false);
});

test('Navoiy Alisher Navoiy Park uses a verified mapping-database representative center', () => {
  const entity = GEO_ENTITIES.find(({ id }) => id === 'uz:navoiy:poi:alisher-navoiy-park');

  assert.ok(entity);
  assert.equal(entity.canonicalName, 'Alisher Navoiy Park');
  assert.equal(entity.parentId, 'uz:navoiy');
  assert.deepEqual(entity.center, { lat: 40.108313, lng: 65.369578 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.accuracy, 'poi');
  assert.equal(entity.accuracyM, 450);
  assert.equal(entity.osm, undefined);

  const resolved = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Navoiy',
    type: 'poi',
    canonical: 'Alisher Navoiy Park',
  });
  assert.equal(resolved?.id, entity.id);
  assert.equal(isUzSecondaryCoverageGap({
    country: 'UZ',
    city: 'Navoiy',
    type: 'poi',
    canonical: 'Alisher Navoiy Park',
  }), false);
});
