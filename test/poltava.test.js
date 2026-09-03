import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaPoltavaCoverageGap } from '../src/coverage-gaps-ua-poltava.js';

test('Poltava verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:poltava');
  assert.equal(children.filter((entity) => entity.type === 'district').length, 3);
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 10);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 6);

  const expected = [
    [{ type: 'district', canonical: 'Kyivskyi' }, 'ua:poltava:district:kyivskyi'],
    [{ type: 'district', canonical: 'Podilskyi' }, 'ua:poltava:district:podilskyi'],
    [{ type: 'district', canonical: 'Shevchenkivskyi' }, 'ua:poltava:district:shevchenkivskyi'],
    [{ type: 'microdistrict', canonical: 'Almaznyi' }, 'ua:poltava:microdistrict:almaznyi'],
    [{ type: 'microdistrict', canonical: 'Sady-1' }, 'ua:poltava:microdistrict:sady-1'],
    [{ type: 'microdistrict', canonical: 'Sady-2' }, 'ua:poltava:microdistrict:sady-2'],
    [{ type: 'microdistrict', canonical: 'Ohnivka' }, 'ua:poltava:microdistrict:ohnivka'],
    [{ type: 'microdistrict', canonical: 'Levada' }, 'ua:poltava:microdistrict:levada'],
    [{ type: 'microdistrict', canonical: 'Podil' }, 'ua:poltava:microdistrict:podil'],
    [{ type: 'microdistrict', canonical: 'Dublianshchyna' }, 'ua:poltava:microdistrict:dublianshchyna'],
    [{ type: 'microdistrict', canonical: 'Pavlenky' }, 'ua:poltava:microdistrict:pavlenky'],
    [{ type: 'microdistrict', canonical: 'Yurivka' }, 'ua:poltava:microdistrict:yurivka'],
    [{ type: 'poi', canonical: 'Korpusnyi Garden' }, 'ua:poltava:poi:korpusnyi-garden'],
    [{ type: 'poi', canonical: 'White Arbor' }, 'ua:poltava:poi:white-arbor'],
    [{ type: 'poi', canonical: 'Peremoha Park' }, 'ua:poltava:poi:peremoha-park'],
    [{ type: 'poi', canonical: 'Poltava Dendropark' }, 'ua:poltava:poi:poltava-dendropark'],
    [{ type: 'poi', canonical: 'Poltava Battle Museum' }, 'ua:poltava:poi:poltava-battle-museum'],
    [{ type: 'poi', canonical: 'Poltava Battle Field' }, 'ua:poltava:poi:poltava-battle-field'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Poltava', ...input })?.id, id);
  }
});

test('Poltava duplicates, hierarchy mismatches and unresolved candidates remain explicit gaps', () => {
  const gaps = [
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Sady-3'],
    ['microdistrict', 'Rozsoshentsi'],
    ['microdistrict', '5 Shkola'],
    ['residential_complex', 'European'],
    ['residential_complex', 'Levada'],
    ['poi', 'Round Square'],
    ['poi', 'Ivanova Hora'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Poltava', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaPoltavaCoverageGap(input), true);
  }
});
