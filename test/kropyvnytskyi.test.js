import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  getGeoEntity,
  resolveLexiconGeoEntity,
} from '../src/index.js';
import { isUaRegionalCoverageGap } from '../src/coverage-gaps-ua-regional.js';

test('Kropyvnytskyi lexicon microdistrict canonicals resolve to one spatial entity', () => {
  const microdistricts = getGeoChildren('ua:kropyvnytskyi').filter((entity) => entity.type === 'microdistrict');
  assert.equal(microdistricts.length, 16);

  const expected = new Map([
    ['Kovalivka', 'ua:kropyvnytskyi:microdistrict:kovalivka'],
    ['Cheremushky', 'ua:kropyvnytskyi:microdistrict:cheremushky'],
    ['Patsaieva', 'ua:kropyvnytskyi:microdistrict:patsaieva'],
    ['101 microdistrict', 'ua:kropyvnytskyi:microdistrict:101-microdistrict'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Kropyvnytskyi', type: 'microdistrict', canonical })?.id, id);
  }
});

test('Kropyvnytskyi verified residential and landmark canonicals resolve', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical: 'Kovalivskyi' })?.id,
    'ua:kropyvnytskyi:residential:kovalivskyi',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Kropyvnytskyi', type: 'poi', canonical: 'St Elizabeth Fortress' })?.id,
    'ua:kropyvnytskyi:poi:st-elizabeth-fortress',
  );
  assert.equal(getGeoEntity('ua:kropyvnytskyi:poi:dendropark')?.source, 'manual');
});

test('unverified Kropyvnytskyi residential lexicon candidates stay explicit gaps', () => {
  for (const canonical of ['Manhattan', 'Perlyna', 'European', 'Kvartal', 'Central']) {
    const input = { country: 'UA', city: 'Kropyvnytskyi', type: 'residential_complex', canonical };
    assert.equal(resolveLexiconGeoEntity(input), null);
    assert.equal(isUaRegionalCoverageGap(input), true);
  }
});
