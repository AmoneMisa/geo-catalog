import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

test('Chamanbog local area owns the OSM polygon while mahalla remains semantic-only', () => {
  const localArea = getGeoEntity('uz:tashkent:local-area:chamanbog');
  const mahalla = getGeoEntity('uz:tashkent:mahalla:chamanbog');

  assert.ok(localArea);
  assert.deepEqual(localArea.osm, { type: 'way', id: 1150374391 });

  assert.ok(mahalla);
  assert.equal(mahalla.type, 'mahalla');
  assert.equal(mahalla.source, 'manual');
  assert.equal(mahalla.osm, undefined);
});
