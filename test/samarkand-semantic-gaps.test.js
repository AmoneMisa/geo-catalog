import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

const transitionPoiGaps = Object.freeze([
  'Samarkand City',
  'Siab Bazaar',
  'University Boulevard',
  'Alisher Navoiy Park',
]);

test('pre-merge Samarkand canonicals remain transition gaps until parsing-lexicon#74 reaches master', () => {
  for (const canonical of transitionPoiGaps) {
    assert.equal(isGeoCoverageGap({
      country: 'UZ',
      city: 'Samarkand',
      type: 'poi',
      canonical,
    }), true, canonical);
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
