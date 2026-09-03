import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaMykolaivCoverageGap } from '../src/coverage-gaps-ua-mykolaiv.js';

test('Mykolaiv verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:mykolaiv');
  assert.equal(children.filter((entity) => entity.type === 'district').length, 4);
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 18);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 5);

  const expected = [
    [{ type: 'district', canonical: 'Tsentralnyi' }, 'ua:mykolaiv:district:tsentralnyi'],
    [{ type: 'district', canonical: 'Zavodskyi' }, 'ua:mykolaiv:district:zavodskyi'],
    [{ type: 'district', canonical: 'Inhulskyi' }, 'ua:mykolaiv:district:inhulskyi'],
    [{ type: 'district', canonical: 'Korabelnyi' }, 'ua:mykolaiv:district:korabelnyi'],
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

test('Mykolaiv named areas use verified OSM points even when legacy bridge type stays microdistrict', () => {
  const expected = new Map([
    ['ua:mykolaiv:microdistrict:temvod', [{ lat: 46.98184, lng: 32.00603 }, 1979458687]],
    ['ua:mykolaiv:microdistrict:shyroka-balka', [{ lat: 46.91804, lng: 32.04529 }, 1980719286]],
  ]);

  for (const [id, [center, nodeId]] of expected) {
    const entity = getGeoEntity(id);
    assert.equal(entity?.source, 'osm', id);
    assert.equal(entity?.accuracy, 'neighborhood', id);
    assert.deepEqual(entity?.center, center, id);
    assert.deepEqual(entity?.osm, { type: 'node', id: nodeId }, id);
  }
});

test('Mykolaiv unresolved and alias-sensitive candidates remain explicit gaps', () => {
  const gaps = [
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'PTZ'],
    ['microdistrict', 'YuTZ'],
    ['residential_complex', 'Admiral'],
    ['poi', 'Flotskyi Boulevard'],
    ['poi', 'Embankment'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Mykolaiv', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaMykolaivCoverageGap(input), true);
  }
});
