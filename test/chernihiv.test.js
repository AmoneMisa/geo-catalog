import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, resolveLexiconGeoEntity } from '../src/index.js';
import { isUaChernihivCoverageGap } from '../src/coverage-gaps-ua-chernihiv.js';

test('Chernihiv verified lexicon geography resolves by city and type', () => {
  const children = getGeoChildren('ua:chernihiv');
  assert.equal(children.filter((entity) => entity.type === 'microdistrict').length, 5);
  assert.equal(children.filter((entity) => entity.type.startsWith('poi.')).length, 6);

  const expected = [
    [{ type: 'microdistrict', canonical: 'Masany' }, 'ua:chernihiv:microdistrict:masany'],
    [{ type: 'microdistrict', canonical: 'Bobrovytsia' }, 'ua:chernihiv:microdistrict:bobrovytsia'],
    [{ type: 'microdistrict', canonical: 'Sherstianka' }, 'ua:chernihiv:microdistrict:sherstianka'],
    [{ type: 'microdistrict', canonical: 'Liskovytsia' }, 'ua:chernihiv:microdistrict:liskovytsia'],
    [{ type: 'microdistrict', canonical: 'Koty' }, 'ua:chernihiv:microdistrict:koty'],
    [{ type: 'poi', canonical: 'Boldyni Hory' }, 'ua:chernihiv:poi:boldyni-hory'],
    [{ type: 'poi', canonical: 'Krasna Square' }, 'ua:chernihiv:poi:krasna-square'],
    [{ type: 'poi', canonical: 'Yalivshchyna' }, 'ua:chernihiv:poi:yalivshchyna'],
    [{ type: 'poi', canonical: 'Transfiguration Cathedral' }, 'ua:chernihiv:poi:transfiguration-cathedral'],
    [{ type: 'poi', canonical: 'Anthony Caves' }, 'ua:chernihiv:poi:anthony-caves'],
    [{ type: 'poi', canonical: 'Yeletskyi Monastery' }, 'ua:chernihiv:poi:yeletskyi-monastery'],
  ];

  for (const [input, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Chernihiv', ...input })?.id, id);
  }
});

test('Chernihiv ambiguous and unresolved candidates remain explicit gaps', () => {
  const gaps = [
    ['district', 'Desnianskyi'],
    ['microdistrict', 'Tsentr'],
    ['microdistrict', 'Podusivka'],
    ['microdistrict', 'Oleksandrivka'],
    ['residential_complex', 'Masany'],
    ['residential_complex', 'Panorama'],
    ['poi', 'Chernihiv Val'],
    ['poi', 'Central Park'],
  ];

  for (const [type, canonical] of gaps) {
    const input = { country: 'UA', city: 'Chernihiv', type, canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaChernihivCoverageGap(input), true);
  }
});
