import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

const expected = new Map([
  ['521 microdistrict', ['ua:kharkiv:microdistrict:521-microdistrict', { lat: 50.018611, lng: 36.338611 }]],
  ['522 microdistrict', ['ua:kharkiv:microdistrict:522-microdistrict', { lat: 50.022417, lng: 36.3269 }]],
  ['531 microdistrict', ['ua:kharkiv:microdistrict:531-microdistrict', { lat: 50.02402, lng: 36.358125 }]],
  ['533 microdistrict', ['ua:kharkiv:microdistrict:533-microdistrict', { lat: 50.020768, lng: 36.369651 }]],
  ['535A', ['ua:kharkiv:microdistrict:535a', { lat: 50.00639, lng: 36.35028 }]],
]);

test('Kharkiv numbered areas resolve to explicit manual spatial anchors', () => {
  for (const [canonical, [id, center]] of expected) {
    const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'microdistrict', canonical });
    assert.equal(entity?.id, id);
    assert.equal(entity?.source, 'manual');
    assert.ok(entity?.sourceUrl?.startsWith('https://wikimapia.org/'));
    assert.deepEqual(entity?.center, center);
  }
});

test('approximate 535A anchor keeps deliberately wider accuracy', () => {
  assert.equal(getGeoEntity('ua:kharkiv:microdistrict:535a')?.accuracyM, 850);
});
