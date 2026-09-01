import test from 'node:test';
import assert from 'node:assert/strict';
import { UA_REGIONAL_LOCATION_EXTENSIONS } from '@whiteslove/parsing-lexicon/ua-location-extensions-regional';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUaSumyCoverageGap } from '../src/coverage-gaps-ua-sumy.js';

const groups = [
  ['districts', 'district'],
  ['microdistricts', 'microdistrict'],
  ['residentialComplexes', 'residential_complex'],
  ['landmarks', 'poi'],
];

test('every Sumy parser canonical is either spatial or an explicit gap', () => {
  const city = UA_REGIONAL_LOCATION_EXTENSIONS.Sumy;
  for (const [key, type] of groups) {
    for (const item of city?.[key] || []) {
      const input = { country: 'UA', city: 'Sumy', type, canonical: item.canonical || item.name };
      const resolved = resolveLexiconGeoEntity(input) !== null;
      const gap = isUaSumyCoverageGap(input);
      assert.notEqual(resolved, gap, `${key}: ${input.canonical} must be exactly one of spatial/gap`);
    }
  }
});

test('Sumy coverage snapshot stays explicit', () => {
  const city = UA_REGIONAL_LOCATION_EXTENSIONS.Sumy;
  const count = (key, type) => (city?.[key] || []).reduce((acc, item) => {
    const input = { country: 'UA', city: 'Sumy', type, canonical: item.canonical || item.name };
    return {
      spatial: acc.spatial + Number(resolveLexiconGeoEntity(input) !== null),
      gaps: acc.gaps + Number(isUaSumyCoverageGap(input)),
    };
  }, { spatial: 0, gaps: 0 });

  assert.deepEqual(count('districts', 'district'), { spatial: 2, gaps: 0 });
  assert.deepEqual(count('microdistricts', 'microdistrict'), { spatial: 12, gaps: 5 });
  assert.deepEqual(count('residentialComplexes', 'residential_complex'), { spatial: 4, gaps: 4 });
  assert.deepEqual(count('landmarks', 'poi'), { spatial: 9, gaps: 0 });
});
