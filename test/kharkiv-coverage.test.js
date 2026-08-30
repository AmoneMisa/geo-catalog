import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoEntity,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('verified Kharkiv microdistrict canonicals resolve to dedicated spatial owners', () => {
  const expected = new Map([
    ['520 microdistrict', 'ua:kharkiv:microdistrict:520-microdistrict'],
    ['606 microdistrict', 'ua:kharkiv:microdistrict:606-microdistrict'],
    ['Moskalevka', 'ua:kharkiv:microdistrict:moskalevka'],
    ['Nova Bavariia', 'ua:kharkiv:microdistrict:nova-bavariia'],
    ['Odeska', 'ua:kharkiv:microdistrict:odeska'],
    ['Skhidnyi', 'ua:kharkiv:microdistrict:skhidnyi'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kharkiv',
      type: 'microdistrict',
      canonical,
    })?.id, id);
  }
});

test('Kharkiv residential complexes use parser canonicals and explicit sources', () => {
  const expected = new Map([
    ['Kliuch', 'ua:kharkiv:residential:kliuch'],
    ['Ptashka', 'ua:kharkiv:residential:ptashka'],
    ['Newton', 'ua:kharkiv:residential:newton'],
    ['Meridian', 'ua:kharkiv:residential:meridian'],
    ['Mira', 'ua:kharkiv:residential:mira'],
    ['Nimeckyi Proekt', 'ua:kharkiv:residential:nimeckyi-proekt'],
    ['Levada 2', 'ua:kharkiv:residential:levada-2'],
    ['Vorobiovi Hory', 'ua:kharkiv:residential:vorobiovi-hory'],
    ['Vorobiovi Hory Family', 'ua:kharkiv:residential:vorobiovi-hory-family'],
    ['Oasis', 'ua:kharkiv:residential:oasis'],
    ['Kazka', 'ua:kharkiv:residential:kazka'],
    ['Manhattan', 'ua:kharkiv:residential:manhattan'],
  ]);

  for (const [canonical, id] of expected) {
    const entity = resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kharkiv',
      type: 'residential_complex',
      canonical,
    });
    assert.equal(entity?.id, id);
    assert.equal(entity?.source, 'manual');
    assert.ok(entity?.sourceUrl);
  }
});

test('Kharkiv landmarks resolve through the generic POI bridge', () => {
  const expected = new Map([
    ['Shevchenko Garden', 'ua:kharkiv:poi:shevchenko-garden'],
    ['Central Park', 'ua:kharkiv:poi:central-park'],
    ['Mirror Stream', 'ua:kharkiv:poi:mirror-stream'],
    ['Historical Museum', 'ua:kharkiv:poi:historical-museum'],
    ['Metalist', 'ua:kharkiv:poi:metalist'],
    ['Nikolsky', 'ua:kharkiv:poi:nikolsky'],
    ['Ave Plaza', 'ua:kharkiv:poi:ave-plaza'],
    ['Dafi', 'ua:kharkiv:poi:dafi'],
    ['Kharkiv-Pasazhyrskyi Station', 'ua:kharkiv:poi:kharkiv-pasazhyrskyi'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({
      country: 'UA',
      city: 'Kharkiv',
      type: 'poi',
      canonical,
    })?.id, id);
  }
});

test('Kharkiv enrichment keeps physical provenance inspectable', () => {
  assert.deepEqual(
    getGeoEntity('ua:kharkiv:microdistrict:520-microdistrict')?.osm,
    { type: 'node', id: 12215617088 },
  );
  assert.equal(
    getGeoEntity('ua:kharkiv:microdistrict:skhidnyi')?.source,
    'geonames',
  );
  assert.deepEqual(
    getGeoEntity('ua:kharkiv:poi:dafi')?.osm,
    { type: 'way', id: 89761454 },
  );
  assert.equal(
    getGeoEntity('ua:kharkiv:residential:kliuch')?.accuracy,
    'building',
  );
});
