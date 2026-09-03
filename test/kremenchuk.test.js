import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';
import { isUaRegionalCoverageGap } from '../src/coverage-gaps-ua-regional.js';

test('Kremenchuk verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:kremenchuk');
  assert.equal(children.filter((entity) => entity.type === 'district').length, 2);
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 10);
  assert.equal(children.filter((entity) => entity.type === 'residential_complex').length, 1);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 4);

  const expected = [
    [{ type: 'district', canonical: 'Avtozavodskyi' }, 'ua:kremenchuk:district:avtozavodskyi'],
    [{ type: 'district', canonical: 'Kriukivskyi' }, 'ua:kremenchuk:district:kriukivskyi'],
    [{ type: 'microdistrict', canonical: 'Molodizhnyi' }, 'ua:kremenchuk:microdistrict:molodizhnyi'],
    [{ type: 'microdistrict', canonical: 'Kriukiv' }, 'ua:kremenchuk:microdistrict:kriukiv'],
    [{ type: 'microdistrict', canonical: 'Tretii Zanasyp' }, 'ua:kremenchuk:microdistrict:tretii-zanasyp'],
    [{ type: 'residential_complex', canonical: 'Tsentralnyi' }, 'ua:kremenchuk:residential:tsentralnyi'],
    [{ type: 'poi', canonical: 'Prydniprovskyi Park' }, 'ua:kremenchuk:poi:prydniprovskyi-park'],
    [{ type: 'poi', canonical: 'Kriukivskyi Bridge' }, 'ua:kremenchuk:poi:kriukivskyi-bridge'],
    [{ type: 'poi', canonical: 'Victory Square' }, 'ua:kremenchuk:poi:victory-square'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kremenchuk', ...input })?.id, id);
  }
});

test('Kremenchuk ambiguous or insufficiently geocoded lexicon candidates remain explicit gaps', () => {
  const gaps = [
    ['microdistrict', 'Vodokanal'],
    ['microdistrict', 'Avtokrazivskyi'],
    ['residential_complex', 'Dniprovska Riviera'],
    ['poi', 'Dnipro Embankment'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Kremenchuk', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaRegionalCoverageGap(input), true);
  }
});
