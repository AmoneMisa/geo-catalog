import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Lisopark resolves to a broad physical park anchor', () => {
  assert.equal(resolveLexiconGeoEntity({
    country: 'UA', city: 'Kharkiv', type: 'poi', canonical: 'Lisopark',
  })?.id, 'ua:kharkiv:poi:lisopark');

  const entity = getGeoEntity('ua:kharkiv:poi:lisopark');
  assert.equal(entity?.type, 'poi.park');
  assert.equal(entity?.source, 'wikidata');
  assert.equal(entity?.wikidataId, 'Q4496321');
  assert.deepEqual(entity?.center, { lat: 50.040833333333, lng: 36.2575 });
  assert.equal(entity?.accuracyM, 3000);
});
