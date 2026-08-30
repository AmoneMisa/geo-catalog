import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const obsoletePoiGaps = Object.freeze([
  'Samarkand City',
  'Siab Bazaar',
  'University Boulevard',
  'Alisher Navoiy Park',
]);

test('obsolete Samarkand POI canonicals are not retained as spatial gaps', () => {
  for (const canonical of obsoletePoiGaps) {
    assert.equal(isGeoCoverageGap({
      country: 'UZ',
      city: 'Samarkand',
      type: 'poi',
      canonical,
    }), false, canonical);
  }
});

test('normalized Samarkand physical owners remain represented by geo-catalog', () => {
  const expected = Object.freeze([
    ['poi', 'Central Park'],
    ['poi', 'Siyob Bazaar'],
    ['street', 'University Boulevard'],
  ]);

  for (const [type, canonicalName] of expected) {
    const entity = GEO_ENTITIES.find((item) => (
      item.parentId === 'uz:samarkand'
      && item.type === type
      && item.canonicalName === canonicalName
    ));
    assert.ok(entity, `${type}: ${canonicalName}`);
  }
});
