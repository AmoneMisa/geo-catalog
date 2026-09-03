import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Berdiansk report-derived owners resolve without POI substitution', () => {
  const lisky = resolveLexiconGeoEntity({ country: 'UA', city: 'Berdiansk', type: 'microdistrict', canonical: 'Lisky' });
  const akz = resolveLexiconGeoEntity({ country: 'UA', city: 'Berdiansk', type: 'microdistrict', canonical: 'AKZ' });
  const square = resolveLexiconGeoEntity({ country: 'UA', city: 'Berdiansk', type: 'poi', canonical: 'Primorska Square' });
  const port = resolveLexiconGeoEntity({ country: 'UA', city: 'Berdiansk', type: 'poi', canonical: 'Sea Port' });

  assert.equal(lisky?.osm?.id, 127597574);
  assert.equal(akz?.osm?.id, 127600072);
  assert.equal(square?.osm?.id, 449123242);
  assert.equal(port?.osm?.id, 13967965);
  assert.equal(getGeoEntity('ua:berdiansk:poi:berdiansk-spit')?.osm?.id, 4791602639);
});

test('Berdychiv keeps street, neighborhood, and monastery owners distinct', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Berdychiv', type: 'microdistrict', canonical: 'Tsentr' })?.osm?.id, 10942509721);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Berdychiv', type: 'microdistrict', canonical: 'Chervona Hora' })?.osm?.id, 12801160);
  assert.equal(getGeoEntity('ua:berdychiv:street:korolenka')?.osm?.id, 193860284);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Berdychiv', type: 'poi', canonical: 'Berdychiv Monastery' })?.osm?.id, 220719640);
});

test('Bilhorod-Dnistrovskyi retains street and exact landmark owners', () => {
  assert.equal(getGeoEntity('ua:bilhorod-dnistrovskyi:street:portovyi-lane')?.osm?.id, 413109017);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Bilhorod-Dnistrovskyi', type: 'poi', canonical: 'Akkerman Fortress' })?.osm?.id, 4309547289);
  assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Bilhorod-Dnistrovskyi', type: 'poi', canonical: 'Dnister Estuary' })?.osm?.id, 7252087);
  assert.equal(getGeoEntity('ua:bilhorod-dnistrovskyi:poi:railway-station')?.osm?.id, 213173299);
});
