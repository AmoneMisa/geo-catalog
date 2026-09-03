import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaVinnytsiaCoverageGap } from '../src/coverage-gaps-ua-vinnytsia.js';

test('Vinnytsia verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:vinnytsia');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 13);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 6);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Tsentr' }, 'ua:vinnytsia:microdistrict:tsentr'],
    [{ type: 'microdistrict', canonical: 'Stare Misto' }, 'ua:vinnytsia:microdistrict:stare-misto'],
    [{ type: 'microdistrict', canonical: 'Zamostia' }, 'ua:vinnytsia:microdistrict:zamostia'],
    [{ type: 'microdistrict', canonical: 'Vyshenka' }, 'ua:vinnytsia:microdistrict:vyshenka'],
    [{ type: 'microdistrict', canonical: 'Piatnychany' }, 'ua:vinnytsia:microdistrict:piatnychany'],
    [{ type: 'microdistrict', canonical: 'Akademichnyi' }, 'ua:vinnytsia:microdistrict:akademichnyi'],
    [{ type: 'microdistrict', canonical: 'Pyrohovo' }, 'ua:vinnytsia:microdistrict:pyrohovo'],
    [{ type: 'poi', canonical: 'Central Park' }, 'ua:vinnytsia:poi:central-park'],
    [{ type: 'poi', canonical: 'Roshen Fountain' }, 'ua:vinnytsia:poi:roshen-fountain'],
    [{ type: 'poi', canonical: 'Vinnytsia Tower' }, 'ua:vinnytsia:poi:vinnytsia-tower'],
    [{ type: 'poi', canonical: 'European Square' }, 'ua:vinnytsia:poi:european-square'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Vinnytsia', ...input })?.id, id);
  }
});

test('Vinnytsia unresolved and hierarchy-sensitive candidates remain explicit gaps', () => {
  const gaps = [
    ['microdistrict', 'Slovianska'],
    ['microdistrict', 'Barske Shose'],
    ['microdistrict', 'Vinnytski Khutory'],
    ['residential_complex', 'Avalon'],
    ['residential_complex', 'European Quarter'],
    ['poi', 'Friendship Park'],
    ['poi', 'Roshen Embankment'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Vinnytsia', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaVinnytsiaCoverageGap(input), true);
  }
});
