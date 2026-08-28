import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaMykolaivCoverageGap } from '../src/coverage-gaps-ua-mykolaiv.js';

test('Mykolaiv verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:mykolaiv');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 8);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 4);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Namiv' }, 'ua:mykolaiv:microdistrict:namiv'],
    [{ type: 'microdistrict', canonical: 'Sukhyi Fontan' }, 'ua:mykolaiv:microdistrict:sukhyi-fontan'],
    [{ type: 'microdistrict', canonical: 'Matviivka' }, 'ua:mykolaiv:microdistrict:matviivka'],
    [{ type: 'microdistrict', canonical: 'Soliani' }, 'ua:mykolaiv:microdistrict:soliani'],
    [{ type: 'microdistrict', canonical: 'Viiskova Slobidka' }, 'ua:mykolaiv:microdistrict:viiskova-slobidka'],
    [{ type: 'microdistrict', canonical: 'Staryi Vodopii' }, 'ua:mykolaiv:microdistrict:staryi-vodopii'],
    [{ type: 'poi', canonical: 'Soborna Square' }, 'ua:mykolaiv:poi:soborna-square'],
    [{ type: 'poi', canonical: 'Mykolaiv Zoo' }, 'ua:mykolaiv:poi:mykolaiv-zoo'],
    [{ type: 'poi', canonical: 'Shipbuilding Museum' }, 'ua:mykolaiv:poi:shipbuilding-museum'],
    [{ type: 'poi', canonical: 'Varvarivskyi Bridge' }, 'ua:mykolaiv:poi:varvarivskyi-bridge'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Mykolaiv', ...input })?.id, id);
  }
});

test('Mykolaiv unresolved and alias-sensitive candidates remain explicit gaps', () => {
  const gaps = [
    ['district', 'Tsentralnyi'],
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Lisky'],
    ['microdistrict', 'PTZ'],
    ['microdistrict', 'YuTZ'],
    ['microdistrict', 'Novyi Vodopii'],
    ['residential_complex', 'Riviera'],
    ['residential_complex', 'Admiral'],
    ['poi', 'Flotskyi Boulevard'],
    ['poi', 'Embankment'],
    ['poi', 'Inhulskyi Bridge'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Mykolaiv', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaMykolaivCoverageGap(input), true);
  }
});
