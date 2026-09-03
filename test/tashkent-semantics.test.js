import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
  validateGeoCatalog,
} from '../src/index.js';

test('Tashkent major streets resolve to verified OSM owners and obsolete Bobur POI is removed', () => {
  const expected = new Map([
    ['Amir Temur Avenue', ['uz:tashkent:street:amir-temur-avenue', 176132087]],
    ['Buyuk Ipak Yoli Street', ['uz:tashkent:street:buyuk-ipak-yoli', 22802833]],
    ['Taras Shevchenko Street', ['uz:tashkent:street:taras-shevchenko', 32082122]],
  ]);
  for (const [canonical, [id, osmId]] of expected) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'street', canonical };
    assert.equal(resolveLexiconGeoEntity(input)?.id, id);
    assert.equal(getGeoEntity(id)?.osm?.id, osmId);
    assert.equal(isGeoCoverageGap(input), false);
  }

  assert.equal(getGeoEntity('uz:tashkent:poi:bobur-park'), null);
  assert.equal(getGeoEntity('uz:tashkent:poi:dostlik-park')?.canonicalName, 'Dostlik Park');

  for (const [canonical, id] of [
    ['Assalom Jomiy', 'uz:tashkent:residential:assalom-jomiy'],
    ['Olmazor City', 'uz:tashkent:residential:olmazor-city'],
    ['Do‘stlar', 'uz:tashkent:residential:dostlar'],
  ]) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'residential_complex', canonical };
    assert.equal(resolveLexiconGeoEntity(input)?.id, id);
    assert.equal(isGeoCoverageGap(input), false);
  }
});

test('Tashkent 0.3 spatial identities use semantic types and district parents', () => {
  for (const [id, type, parentId] of [
    ['uz:tashkent:microdistrict:tashselmash', 'microdistrict', 'uz:tashkent:yashnobod'],
    ['uz:tashkent:microdistrict:aviasozlar', 'microdistrict', 'uz:tashkent:yashnobod'],
    ['uz:tashkent:microdistrict:kuylyuk', 'microdistrict', 'uz:tashkent:sergeli'],
    ['uz:tashkent:microdistrict:yangi-choshtepa', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:olympia', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:dustlik-1', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:dustlik-2', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sputnik', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:karasu-1', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:karasu-6', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:ttz-1', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:ttz-3', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:sergeli-3a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sergeli-5a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sergeli-7a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sebzar', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:karakamysh', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:chilanzar-1', 'microdistrict', 'uz:tashkent:chilanzar'],
    ['uz:tashkent:microdistrict:chilanzar-11', 'microdistrict', 'uz:tashkent:uchtepa'],
    ['uz:tashkent:microdistrict:chilanzar-15', 'microdistrict', 'uz:tashkent:uchtepa'],
    ['uz:tashkent:microdistrict:chilanzar-20', 'microdistrict', 'uz:tashkent:chilanzar'],
    ['uz:tashkent:microdistrict:yunusabad-4', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:microdistrict:yunusabad-5', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:microdistrict:yunusabad-19', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:local-area:qorasuv', 'local_area', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:local-area:uzgarish', 'local_area', 'uz:tashkent:sergeli'],
    ['uz:tashkent:local-area:beshagach', 'local_area', 'uz:tashkent:chilanzar'],
  ]) {
    const entity = getGeoEntity(id);
    assert.equal(entity?.type, type, id);
    assert.equal(entity?.parentId, parentId, id);
  }
});

test('newly resolved Tashkent massifs keep defensible provenance', () => {
  const karasu6 = getGeoEntity('uz:tashkent:microdistrict:karasu-6');
  assert.equal(karasu6?.osm?.type, 'node');
  assert.equal(karasu6?.osm?.id, 1868229640);

  const yunusabad5 = getGeoEntity('uz:tashkent:microdistrict:yunusabad-5');
  assert.equal(yunusabad5?.osm?.type, 'node');
  assert.equal(yunusabad5?.osm?.id, 1867002800);

  const sputnik = getGeoEntity('uz:tashkent:microdistrict:sputnik');
  assert.equal(sputnik?.source, 'manual');
  assert.equal(sputnik?.accuracy, 'approximate');
  assert.ok(sputnik?.accuracyM >= 2000);

  const ttz3 = getGeoEntity('uz:tashkent:microdistrict:ttz-3');
  assert.equal(ttz3?.source, 'manual');
  assert.equal(ttz3?.accuracy, 'approximate');
  assert.equal(ttz3?.center?.lat, 41.3537);
  assert.equal(ttz3?.center?.lng, 69.3831);
  assert.ok(ttz3?.accuracyM >= 900);
  assert.equal(ttz3?.osm, undefined);

  const qorasuv = getGeoEntity('uz:tashkent:local-area:qorasuv');
  assert.equal(qorasuv?.source, 'manual');
  assert.equal(qorasuv?.center?.lat, 41.333675);
  assert.equal(qorasuv?.center?.lng, 69.372236);
});

test('resolved Tashkent massif batch has no remaining spatial gap', () => {
  for (const canonical of ['Sputnik', 'Karasu-6', 'Yunusabad-5', 'TTZ-3']) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical }),
      false,
      canonical,
    );
    assert.ok(
      resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical }),
      canonical,
    );
  }

  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Qorasuv' }),
    false,
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Qorasuv' })?.id,
    'uz:tashkent:local-area:qorasuv',
  );
});

test('new Tashkent typed microdistricts use distinct validated OSM boundaries', () => {
  const expected = new Map([
    ['Traktorsozlar-1', ['uz:tashkent:microdistrict:ttz-1', 1866270]],
    ['Traktorsozlar-2', ['uz:tashkent:microdistrict:ttz-2', 1866173]],
    ['Traktorsozlar-4', ['uz:tashkent:microdistrict:ttz-4', 1866285]],
    ['Qiyot', ['uz:tashkent:microdistrict:qiyot', 2351549]],
  ]);

  for (const [canonical, [id, relationId]] of expected) {
    const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical });
    assert.equal(entity?.id, id, canonical);
    assert.deepEqual(entity?.osm, { type: 'relation', id: relationId }, canonical);
    assert.equal(entity?.boundary?.type, 'Polygon', canonical);
  }

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'Manzara' }), true);
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'metro', canonical: 'Qiyot' })?.id, 'uz:tashkent:metro:qiyot');
});

test('Dehqonobod resolves to the Mirobod area near the Russian Embassy and bazaar', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dehqonobod' });
  assert.equal(entity?.id, 'uz:tashkent:local-area:dehqonobod');
  assert.equal(entity?.parentId, 'uz:tashkent:mirobod');
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 750);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Dehqonobod' }), false);
});

test('Buyuk Ipak Yuli area resolves through the historical Maksim Gorkiy locality', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Buyuk Ipak Yuli' });
  assert.equal(area?.id, 'uz:tashkent:local-area:buyuk-ipak-yuli');
  assert.equal(area?.parentId, 'uz:tashkent:mirzo-ulugbek');
  assert.deepEqual(area?.osm, { type: 'node', id: 5267587643 });
  assert.equal(area?.accuracy, 'neighborhood');

  const metro = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'metro', canonical: 'Buyuk Ipak Yoli' });
  assert.equal(metro?.id, 'uz:tashkent:metro:buyuk-ipak-yoli');
  assert.notEqual(area?.osm?.id, metro?.osm?.id);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Buyuk Ipak Yuli' }), false);
});

test('Geofizika resolves to the Mirzo Ulugbek university area', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Geofizika' });
  assert.equal(entity?.id, 'uz:tashkent:local-area:geofizika');
  assert.equal(entity?.parentId, 'uz:tashkent:mirzo-ulugbek');
  assert.deepEqual(entity?.center, { lat: 41.3413252, lng: 69.3403061 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.ok(entity?.accuracyM >= 1000);
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Geofizika' }), false);
});

test('Chorsu resolves to its mavze boundary near Chorsu Bazaar', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Chorsu' });
  assert.equal(area?.id, 'uz:tashkent:local-area:chorsu');
  assert.equal(area?.parentId, 'uz:tashkent:shaykhantahur');
  assert.deepEqual(area?.osm, { type: 'way', id: 144057363 });
  assert.equal(area?.boundary?.type, 'Polygon');

  const metro = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'metro', canonical: 'Chorsu' });
  assert.equal(metro?.id, 'uz:tashkent:metro:chorsu');
  assert.notEqual(area?.osm?.id, metro?.osm?.id);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Chorsu' }), false);
});

test('Kuylyuk Center resolves to Qo\'yliq markaz inside Yashnobod', () => {
  const center = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Kuylyuk Center' });
  assert.equal(center?.id, 'uz:tashkent:local-area:kuylyuk-center');
  assert.equal(center?.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(center?.center, { lat: 41.240623, lng: 69.332279 });
  assert.equal(center?.source, 'manual');
  assert.equal(center?.accuracy, 'approximate');
  assert.equal(center?.osm, undefined);

  const broaderArea = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'Kuylyuk' });
  assert.equal(broaderArea?.id, 'uz:tashkent:microdistrict:kuylyuk');
  assert.notEqual(center?.id, broaderArea?.id);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Kuylyuk Center' }), false);
});

test('Lolazor area, street and Bagichinar address remain distinct Uchtepa entities', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Lolazor' });
  assert.equal(area?.id, 'uz:tashkent:local-area:lolazor');
  assert.equal(area?.parentId, 'uz:tashkent:uchtepa');
  assert.deepEqual(area?.center, { lat: 41.325387, lng: 69.176835 });
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Lolazor' }), false);

  const street = getGeoEntity('uz:tashkent:street:lolazor');
  assert.deepEqual(street?.osm, { type: 'way', id: 104106516 });
  assert.equal(street?.parentId, 'uz:tashkent:uchtepa');

  const address = getGeoEntity('uz:tashkent:address:bagichinar-mahallah-citizens-assembly');
  assert.equal(address?.parentId, area?.id);
  assert.deepEqual(address?.center, { lat: 41.325387, lng: 69.176835 });
  assert.equal(address?.type, 'address');
});

test('Shohimardon area, street and Passage 1 remain distinct Yashnobod entities', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shohimardon' });
  assert.equal(area?.id, 'uz:tashkent:local-area:shohimardon');
  assert.equal(area?.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(area?.center, { lat: 41.2736, lng: 69.3522 });
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shohimardon' }), false);

  const street = getGeoEntity('uz:tashkent:street:shohimardon');
  assert.deepEqual(street?.osm, { type: 'way', id: 88462641 });
  assert.equal(street?.parentId, 'uz:tashkent:yashnobod');

  const passage = getGeoEntity('uz:tashkent:street:shohimardon-passage-1');
  assert.deepEqual(passage?.center, { lat: 41.272762, lng: 69.348898 });
  assert.equal(passage?.source, 'manual');
  assert.equal(passage?.osm, undefined);
});

test("Oltinkul area, Oltinko'l street, Passage 1 and house 24 preserve their hierarchy", () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Oltinkul' });
  assert.equal(area?.id, 'uz:tashkent:local-area:oltinkul');
  assert.equal(area?.parentId, 'uz:tashkent:mirobod');
  assert.deepEqual(area?.center, { lat: 41.2665, lng: 69.298745 });
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Oltinkul' }), false);

  const street = getGeoEntity('uz:tashkent:street:oltinkul');
  const passage = getGeoEntity('uz:tashkent:street:oltinkul-passage-1');
  const address = getGeoEntity('uz:tashkent:address:oltinkul-passage-1-24');
  assert.equal(street?.parentId, area?.id);
  assert.equal(passage?.parentId, street?.id);
  assert.equal(address?.parentId, passage?.id);
  assert.deepEqual(address?.center, { lat: 41.2665, lng: 69.298745 });
  assert.equal(address?.accuracy, 'building');
});

test('Al-Khorezmi-1 resolves to the verified Chilanzar residential-area point', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Al-Khorezmi-1' });
  assert.equal(area?.id, 'uz:tashkent:local-area:al-khorezmi-1');
  assert.equal(area?.parentId, 'uz:tashkent:chilanzar');
  assert.deepEqual(area?.center, { lat: 41.259301, lng: 69.154431 });
  assert.equal(area?.source, 'manual');
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Al-Khorezmi-1' }), false);
});

test('Rakatboshi area and street remain distinct Yakkasaray entities', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Rakatboshi' });
  assert.equal(area?.id, 'uz:tashkent:local-area:rakatboshi');
  assert.equal(area?.parentId, 'uz:tashkent:yakkasaray');
  assert.deepEqual(area?.center, { lat: 41.300956, lng: 69.258159 });
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Rakatboshi' }), false);

  const street = getGeoEntity('uz:tashkent:street:rakatboshi');
  assert.equal(street?.parentId, area?.id);
  assert.deepEqual(street?.center, { lat: 41.300956, lng: 69.258159 });
  assert.equal(street?.type, 'street');
  assert.equal(street?.osm, undefined);
});

test('Manzara residential complex remains distinct from the resolved local area and unresolved microdistrict', () => {
  const complex = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'residential_complex', canonical: 'Manzara' });
  assert.equal(complex?.id, 'uz:tashkent:residential:manzara');
  assert.equal(complex?.parentId, 'uz:tashkent:yunusabad');
  assert.deepEqual(complex?.center, { lat: 41.356109, lng: 69.314573 });
  assert.equal(complex?.accuracy, 'building');

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'Manzara' }), true);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Manzara' }), false);
});

test('Taxtapul mahalla and Almazar area remain separate identities', () => {
  const mahalla = getGeoEntity('uz:tashkent:mahalla:taxtapul');
  const area = getGeoEntity('uz:tashkent:local-area:taxtapul');
  assert.deepEqual(mahalla?.osm, { type: 'node', id: 9687947537 });
  assert.equal(mahalla?.parentId, 'uz:tashkent:shaykhantahur');
  assert.equal(area?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(area?.center, { lat: 41.343113, lng: 69.259525 });
  assert.equal(area?.source, 'manual');
  assert.equal(getGeoEntity('uz:tashkent:local-area:takhtapul'), null);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Taxtapul' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Takhtapul' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Taxtapul' }), false);
  assert.notEqual(mahalla?.id, area?.id);
});

test('Ibn Sino mahalla owns its verified Shaykhantahur boundary', () => {
  const mahalla = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Ibn Sino' });
  assert.equal(mahalla?.id, 'uz:tashkent:mahalla:ibn-sino');
  assert.equal(mahalla?.parentId, 'uz:tashkent:shaykhantahur');
  assert.deepEqual(mahalla?.osm, { type: 'way', id: 149991108 });
  assert.equal(mahalla?.boundary?.type, 'Polygon');
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Ibn Sino' }), false);

  const ibnSino1 = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Ibn Sino-1' });
  assert.equal(ibnSino1?.id, 'uz:tashkent:local-area:ibn-sino-1');
  assert.deepEqual(ibnSino1?.osm, { type: 'way', id: 103249732 });
  assert.notEqual(ibnSino1?.osm?.id, mahalla?.osm?.id);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Ibn Sino-1' }), false);
});

test('Akademgorodok owns its academy-campus polygon in Mirzo Ulugbek', () => {
  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Akademgorodok' });
  assert.equal(area?.id, 'uz:tashkent:local-area:akademgorodok');
  assert.equal(area?.parentId, 'uz:tashkent:mirzo-ulugbek');
  assert.deepEqual(area?.osm, { type: 'relation', id: 2408893 });
  assert.equal(area?.boundary?.type, 'Polygon');
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Akademgorodok' }), false);
});

test('Gulobod and Sebzor streets remain distinct from mahallas and resolved local areas', () => {
  const gulobod = getGeoEntity('uz:tashkent:street:gulobod');
  assert.equal(gulobod?.parentId, 'uz:tashkent:shaykhantahur');
  assert.deepEqual(gulobod?.osm, { type: 'way', id: 641077612 });

  const sebzor = getGeoEntity('uz:tashkent:street:sebzor');
  assert.equal(sebzor?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(sebzor?.osm, { type: 'way', id: 641787547 });

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Gulobod' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Sebzor' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Gulobod' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Sebzor' }), false);
});

test('Taraqqiyot mahalla remains distinct from its numbered local areas', () => {
  const mahalla = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Taraqqiyot' });
  assert.equal(mahalla?.id, 'uz:tashkent:mahalla:taraqqiyot');
  assert.equal(mahalla?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(mahalla?.osm, { type: 'way', id: 1134501657 });
  assert.equal(mahalla?.boundary?.type, 'Polygon');
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Taraqqiyot' }), false);

  for (const canonical of ['Taraqqiyot-1', 'Taraqqiyot-2', 'Taraqqiyot-3', 'Taraqqiyot-4']) {
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical }), false, canonical);
    assert.notEqual(resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical })?.id, mahalla?.id, canonical);
  }
});
test('C-7, Chuqursoy and Shimoliy Olmazor resolve to distinct OSM residential polygons', () => {
  const expected = new Map([
    ['C-7', ['uz:tashkent:local-area:c-7', 'uz:tashkent:mirobod', 182164644]],
    ['Chuqursoy', ['uz:tashkent:local-area:chuqursoy', 'uz:tashkent:almazar', 150455349]],
    ['Shimoliy Olmazor', ['uz:tashkent:local-area:shimoliy-olmazor', 'uz:tashkent:almazar', 140358603]],
  ]);

  for (const [canonical, [id, parentId, osmId]] of expected) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);
    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, parentId, canonical);
    assert.deepEqual(entity?.osm, { type: 'way', id: osmId }, canonical);
    assert.equal(entity?.boundary?.type, 'Polygon', canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shimoliy Olmazor-1' }), true);
});

test('Suvsoz-1 and Suvsoz-2 resolve to distinct Bektemir residential areas', () => {
  const expected = new Map([
    ['Suvsoz-1', ['uz:tashkent:local-area:suvsoz-1', 'relation', 19801804]],
    ['Suvsoz-2', ['uz:tashkent:local-area:suvsoz-2', 'way', 153528330]],
  ]);

  for (const [canonical, [id, osmType, osmId]] of expected) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);
    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, 'uz:tashkent:bektemir', canonical);
    assert.deepEqual(entity?.osm, { type: osmType, id: osmId }, canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Suvsoz-3' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Suvsoz-5' }), false);
});

test('verified dahasi points remain distinct from independently mapped mahallas', () => {
  const expected = new Map([
    ['Ahmad Yugnakiy', ['uz:tashkent:local-area:ahmad-yugnakiy', 1867262863]],
    ["Bog'ko'cha", ['uz:tashkent:local-area:bogkocha', 1223133760]],
    ['Irrigator', ['uz:tashkent:local-area:irrigator', 4730061324]],
    ['Parkent', ['uz:tashkent:local-area:parkent', 13264841185]],
  ]);

  for (const [canonical, [id, osmId]] of expected) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);
    assert.equal(entity?.id, id, canonical);
    assert.deepEqual(entity?.osm, { type: 'node', id: osmId }, canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Ahmad Yugnakiy' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Olimpiya' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Olimpiya' }), false);
});

test('ToshGRES uses the lexicon canonical on its existing OSM owner', () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'ToshGRES' };
  const entity = resolveLexiconGeoEntity(input);
  assert.equal(entity?.id, 'uz:tashkent:local-area:tashgres');
  assert.equal(entity?.canonicalName, 'ToshGRES');
  assert.deepEqual(entity?.osm, { type: 'node', id: 1866983396 });
  assert.equal(isGeoCoverageGap(input), false);
});

test('Taxtapul mahalla does not consume the distinct Almazar local-area identity', () => {
  const mahallaInput = { country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Taxtapul' };
  const mahalla = resolveLexiconGeoEntity(mahallaInput);
  const areaInput = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Taxtapul' };
  const area = resolveLexiconGeoEntity(areaInput);
  assert.equal(mahalla?.id, 'uz:tashkent:mahalla:taxtapul');
  assert.equal(mahalla?.parentId, 'uz:tashkent:shaykhantahur');
  assert.deepEqual(mahalla?.osm, { type: 'node', id: 9687947537 });
  assert.equal(area?.id, 'uz:tashkent:local-area:taxtapul');
  assert.equal(area?.parentId, 'uz:tashkent:almazar');
  assert.equal(area?.source, 'manual');
  assert.equal(area?.osm, undefined);
  assert.notEqual(area?.id, mahalla?.id);
  assert.equal(isGeoCoverageGap(mahallaInput), false);
  assert.equal(isGeoCoverageGap(areaInput), false);
});

test("Bog'bon Street remains distinct from Yashnobod mahalla and resolved local area", () => {
  const street = getGeoEntity('uz:tashkent:street:bogbon');
  assert.equal(street?.parentId, 'uz:tashkent:yunusabad');
  assert.deepEqual(street?.osm, { type: 'way', id: 105705400 });

  const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "Bog'bon" });
  assert.equal(area?.id, 'uz:tashkent:local-area:bogbon');
  assert.equal(area?.parentId, 'uz:tashkent:yashnobod');
  assert.deepEqual(area?.osm, { type: 'way', id: 557224880 });

  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: "Bog'bon" }), true);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: "Bog'bon" }), false);
});

test('same-name streets remain independent from resolved area identities', () => {
  const expected = new Map([
    ['muxbir', ['uz:tashkent:almazar', 139815768]],
    ['minora', ['uz:tashkent:almazar', 1133450564]],
    ['shifokorlar', ['uz:tashkent:almazar', 592362803]],
    ['asalobod', ['uz:tashkent:yashnobod', 106373371]],
  ]);

  for (const [slug, [parentId, osmId]] of expected) {
    const street = getGeoEntity(`uz:tashkent:street:${slug}`);
    assert.equal(street?.parentId, parentId, slug);
    assert.deepEqual(street?.osm, { type: 'way', id: osmId }, slug);
  }

  for (const canonical of ['Muxbir', 'Minora']) {
    const area = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical });
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical }), false, canonical);
    assert.equal(area?.source, 'manual', canonical);
    assert.equal(area?.osm, undefined, canonical);
    assert.notEqual(area?.id, `uz:tashkent:street:${canonical.toLowerCase()}`, canonical);
  }
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Asalobod' }), false);
  assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Shifokorlar' }), false);
});

test('Tashkent City has a development-area identity instead of a local-area identity', () => {
  const entity = getGeoEntity('uz:tashkent:development-area:tashkent-city');
  assert.equal(entity?.type, 'development_area');
  assert.equal(entity?.parentId, 'uz:tashkent');
  assert.equal(getGeoEntity('uz:tashkent:local-area:tashkent-city'), null);

  assert.equal(
    resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'development_area', canonical: 'Tashkent City' })?.id,
    'uz:tashkent:development-area:tashkent-city',
  );
});

test('Minor has one physical neighborhood owner in addition to the distinct metro station', () => {
  assert.equal(getGeoEntity('uz:tashkent:local-area:minor'), null);
  assert.equal(getGeoEntity('uz:tashkent:mahalla:minor')?.osm?.id, 1012743631);
  assert.ok(getGeoEntity('uz:tashkent:metro:minor'));
});

test('catalog validation rejects two logical owners of one OSM object', () => {
  const entities = [
    {
      id: 'test:a', type: 'local_area', country: 'UZ', canonicalName: 'A',
      center: { lat: 41.3, lng: 69.2 }, osm: { type: 'node', id: 12345 },
    },
    {
      id: 'test:b', type: 'mahalla', country: 'UZ', canonicalName: 'B',
      center: { lat: 41.3, lng: 69.2 }, osm: { type: 'node', id: 12345 },
    },
  ];
  const report = validateGeoCatalog(entities);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some((error) => error.includes('duplicate physical OSM entity node:12345')));
});