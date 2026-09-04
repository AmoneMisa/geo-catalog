import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaCherkasyCoverageGap } from '../src/coverage-gaps-ua-cherkasy.js';

test('Cherkasy verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:cherkasy');
  assert.equal(children.filter((entity) => entity.type === 'district').length, 2);
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 8);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 12);

  const expected = [
    [{ type: 'district', canonical: 'Prydniprovskyi' }, 'ua:cherkasy:district:prydniprovskyi'],
    [{ type: 'district', canonical: 'Sosnivskyi' }, 'ua:cherkasy:district:sosnivskyi'],
    [{ type: 'microdistrict', canonical: 'Mytnytsia' }, 'ua:cherkasy:microdistrict:mytnytsia'],
    [{ type: 'microdistrict', canonical: 'Kazbet' }, 'ua:cherkasy:microdistrict:kazbet'],
    [{ type: 'microdistrict', canonical: 'Sosnivka' }, 'ua:cherkasy:microdistrict:sosnivka'],
    [{ type: 'microdistrict', canonical: 'Pivdenno-Zakhidnyi' }, 'ua:cherkasy:microdistrict:pivdenno-zakhidnyi'],
    [{ type: 'microdistrict', canonical: 'Dakhnivka' }, 'ua:cherkasy:microdistrict:dakhnivka'],
    [{ type: 'poi', canonical: 'Valley of Roses' }, 'ua:cherkasy:poi:valley-of-roses'],
    [{ type: 'poi', canonical: 'Victory Park' }, 'ua:cherkasy:poi:victory-park'],
    [{ type: 'poi', canonical: 'Sosnovyi Bir' }, 'ua:cherkasy:poi:sosnovyi-bir'],
    [{ type: 'poi', canonical: 'Chemists Park' }, 'ua:cherkasy:poi:chemists-park'],
    [{ type: 'poi', canonical: 'Hill of Glory' }, 'ua:cherkasy:poi:hill-of-glory'],
    [{ type: 'poi', canonical: 'Cherkasy Zoo' }, 'ua:cherkasy:poi:cherkasy-zoo'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Cherkasy', ...input })?.id, id);
  }
});

test('Cherkasy unresolved candidates remain explicit gaps', () => {
  const gaps = [
    ['microdistrict', '700-richchia'],
    ['residential_complex', 'Symfonia'],
    ['residential_complex', 'European'],
    ['poi', 'Dnipro Embankment'],
    ['poi', 'Wedding Palace'],
    ['poi', 'House with Chimeras'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Cherkasy', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaCherkasyCoverageGap(input), true);
  }
});
