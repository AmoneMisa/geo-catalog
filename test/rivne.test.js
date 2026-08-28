import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaRivneCoverageGap } from '../src/coverage-gaps-ua-rivne.js';

test('Rivne verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:rivne');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 5);
  assert.equal(children.filter((entity) => entity.type === 'residential_complex').length, 7);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 9);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Boyarka' }, 'ua:rivne:microdistrict:boyarka'],
    [{ type: 'microdistrict', canonical: 'Tynne' }, 'ua:rivne:microdistrict:tynne'],
    [{ type: 'microdistrict', canonical: 'Basiv Kut' }, 'ua:rivne:microdistrict:basiv-kut'],
    [{ type: 'microdistrict', canonical: 'Shchaslyve' }, 'ua:rivne:microdistrict:shchaslyve'],
    [{ type: 'residential_complex', canonical: 'Spectrum' }, 'ua:rivne:residential:spectrum'],
    [{ type: 'residential_complex', canonical: 'Bridge Tower' }, 'ua:rivne:residential:bridge-tower'],
    [{ type: 'poi', canonical: 'Rivne Zoo' }, 'ua:rivne:poi:rivne-zoo'],
    [{ type: 'poi', canonical: 'Maidan Nezalezhnosti' }, 'ua:rivne:poi:maidan-nezalezhnosti'],
    [{ type: 'poi', canonical: 'Pokrovskyi Cathedral' }, 'ua:rivne:poi:pokrovskyi-cathedral'],
    [{ type: 'poi', canonical: 'Rivne Railway Station' }, 'ua:rivne:poi:rivne-railway-station'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Rivne', ...input })?.id, id);
  }
});

test('Rivne unresolved parser canonicals remain explicit coverage gaps', () => {
  const gaps = [
    ['district', 'Pivnichnyi'],
    ['district', 'Tsentralnyi'],
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Yuvileinyi'],
    ['microdistrict', 'Pyvzavod'],
    ['residential_complex', 'Prestige'],
    ['residential_complex', 'Panorama'],
    ['poi', 'Hydropark'],
    ['poi', 'Prosvity Park'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Rivne', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaRivneCoverageGap(input), true);
  }
});
