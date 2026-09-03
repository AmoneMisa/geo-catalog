import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren } from '../src/index.js';

test('Konotop exposes verified core POIs', () => {
  const children = getGeoChildren('ua:konotop');
  const ids = new Set(children.map((entity) => entity.id));

  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 3);
  assert.ok(ids.has('ua:konotop:poi:railway-station'));
  assert.ok(ids.has('ua:konotop:poi:local-history-museum'));
  assert.ok(ids.has('ua:konotop:poi:dragomirov-house-museum'));
});
