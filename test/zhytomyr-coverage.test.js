import test from 'node:test';
import assert from 'node:assert/strict';
import { UA_REGIONAL_LOCATION_EXTENSIONS } from '@whiteslove/parsing-lexicon/ua-location-extensions-regional';
import { resolveLexiconGeoEntityExact } from '../src/lexicon-bridge.js';
import { isUaZhytomyrCoverageGap } from '../src/coverage-gaps-ua-zhytomyr.js';

const groups = [
  ['microdistricts', 'microdistrict'],
  ['residentialComplexes', 'residential_complex'],
  ['landmarks', 'poi'],
];

test('every Zhytomyr parser canonical is either spatial or an explicit gap', () => {
  const city = UA_REGIONAL_LOCATION_EXTENSIONS.Zhytomyr;
  for (const [key, type] of groups) {
    for (const item of city?.[key] || []) {
      const input = { country: 'UA', city: 'Zhytomyr', type, canonical: item.canonical || item.name };
      const resolved = resolveLexiconGeoEntityExact(input) !== null;
      const gap = isUaZhytomyrCoverageGap(input);
      assert.notEqual(resolved, gap, `${key}: ${input.canonical} must be exactly one of spatial/gap`);
    }
  }
});

test('Zhytomyr coverage snapshot stays explicit', () => {
  const city = UA_REGIONAL_LOCATION_EXTENSIONS.Zhytomyr;
  const count = (key, type) => (city?.[key] || []).reduce((acc, item) => {
    const input = { country: 'UA', city: 'Zhytomyr', type, canonical: item.canonical || item.name };
    return {
      spatial: acc.spatial + Number(resolveLexiconGeoEntityExact(input) !== null),
      gaps: acc.gaps + Number(isUaZhytomyrCoverageGap(input)),
    };
  }, { spatial: 0, gaps: 0 });

  assert.deepEqual(count('microdistricts', 'microdistrict'), { spatial: 4, gaps: 13 });
  assert.deepEqual(count('residentialComplexes', 'residential_complex'), { spatial: 0, gaps: 8 });
  assert.deepEqual(count('landmarks', 'poi'), { spatial: 6, gaps: 2 });
});
