import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaKhersonCoverageGap } from '../src/coverage-gaps-ua-kherson.js';

test('Kherson verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:kherson');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 12);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 7);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Tavriiskyi' }, 'ua:kherson:microdistrict:tavriiskyi'],
    [{ type: 'microdistrict', canonical: 'Tavriiskyi-2' }, 'ua:kherson:microdistrict:tavriiskyi-2'],
    [{ type: 'microdistrict', canonical: 'Pivnichnyi' }, 'ua:kherson:microdistrict:pivnichnyi'],
    [{ type: 'microdistrict', canonical: 'Zhytloselyshche' }, 'ua:kherson:microdistrict:zhytloselyshche'],
    [{ type: 'microdistrict', canonical: 'Ostriv' }, 'ua:kherson:microdistrict:ostriv'],
    [{ type: 'microdistrict', canonical: 'Sklotara' }, 'ua:kherson:microdistrict:sklotara'],
    [{ type: 'poi', canonical: 'Kherson Fortress Park' }, 'ua:kherson:poi:kherson-fortress-park'],
    [{ type: 'poi', canonical: 'Kherson River Port' }, 'ua:kherson:poi:kherson-river-port'],
    [{ type: 'poi', canonical: 'St Catherine Cathedral' }, 'ua:kherson:poi:st-catherine-cathedral'],
    [{ type: 'poi', canonical: 'Kherson Railway Station' }, 'ua:kherson:poi:kherson-railway-station'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kherson', ...input })?.id, id);
  }
});

test('Kherson hierarchy, alias and unresolved candidates remain explicit gaps', () => {
  const gaps = [
    ['district', 'Tsentralnyi'],
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Tavriiskyi-1'],
    ['microdistrict', 'Korabel'],
    ['microdistrict', 'Antonivka'],
    ['microdistrict', 'Zelenivka'],
    ['microdistrict', 'Komyshany'],
    ['residential_complex', 'Admiral'],
    ['residential_complex', 'European'],
    ['poi', 'Potemkin Square'],
    ['poi', 'Dnipro Embankment'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Kherson', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaKhersonCoverageGap(input), true);
  }
});
