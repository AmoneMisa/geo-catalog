import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';
import { isUaRegionalCoverageGap } from '../src/coverage-gaps-ua-regional.js';

test('Bila Tserkva verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:bila-tserkva');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 9);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 5);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Levanevskoho' }, 'ua:bila-tserkva:microdistrict:levanevskoho'],
    [{ type: 'microdistrict', canonical: 'Pishchanyi' }, 'ua:bila-tserkva:microdistrict:pishchanyi'],
    [{ type: 'microdistrict', canonical: 'Tarashchanskyi' }, 'ua:bila-tserkva:microdistrict:tarashchanskyi'],
    [{ type: 'microdistrict', canonical: 'Haiok' }, 'ua:bila-tserkva:microdistrict:haiok'],
    [{ type: 'poi', canonical: 'Oleksandriia Arboretum' }, 'ua:bila-tserkva:poi:oleksandriia-arboretum'],
    [{ type: 'poi', canonical: 'Castle Hill' }, 'ua:bila-tserkva:poi:castle-hill'],
    [{ type: 'poi', canonical: 'Torhova Square' }, 'ua:bila-tserkva:poi:torhova-square'],
    [{ type: 'poi', canonical: 'Shevchenko Park' }, 'ua:bila-tserkva:poi:shevchenko-park'],
    [{ type: 'poi', canonical: 'Soborna Square' }, 'ua:bila-tserkva:poi:soborna-square'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Bila Tserkva', ...input })?.id, id);
  }
});

test('Bila Tserkva unresolved parser canonicals remain explicit coverage gaps', () => {
  const gaps = [
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Pionerska'],
    ['microdistrict', '5 microdistrict'],
    ['microdistrict', '6 microdistrict'],
    ['poi', 'Ros River'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Bila Tserkva', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaRegionalCoverageGap(input), true);
  }
});
