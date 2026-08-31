import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv Raiduzhnyi resolves to the Lev Landau residential complex anchor', () => {
  const entity = resolveLexiconGeoEntity({
    country: 'UA',
    city: 'Kharkiv',
    type: 'residential_complex',
    canonical: 'Raiduzhnyi',
  });

  assert.equal(entity?.id, 'ua:kharkiv:residential:raiduzhnyi');
  assert.deepEqual(entity?.center, { lat: 49.96418197971342, lng: 36.30897133284614 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracyM, 900);
  assert.match(entity?.sourceUrl ?? '', /maps\.visicom\.ua/);
});
