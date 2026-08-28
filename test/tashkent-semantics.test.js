import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
  validateGeoCatalog,
} from '../src/index.js';

test('Tashkent 0.3 spatial identities use semantic types and district parents', () => {
  for (const [id, type, parentId] of [
    ['uz:tashkent:microdistrict:tashselmash', 'microdistrict', 'uz:tashkent:yashnobod'],
    ['uz:tashkent:microdistrict:aviasozlar', 'microdistrict', 'uz:tashkent:yashnobod'],
    ['uz:tashkent:microdistrict:kuylyuk', 'microdistrict', 'uz:tashkent:mirobod'],
    ['uz:tashkent:microdistrict:yangi-choshtepa', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:olympia', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:dustlik-1', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:dustlik-2', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sputnik', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:karasu-1', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:karasu-6', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:ttz-1', 'microdistrict', 'uz:tashkent:mirzo-ulugbek'],
    ['uz:tashkent:microdistrict:sergeli-3a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sergeli-5a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sergeli-7a', 'microdistrict', 'uz:tashkent:yangihayot'],
    ['uz:tashkent:microdistrict:sebzar', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:karakamysh', 'microdistrict', 'uz:tashkent:almazar'],
    ['uz:tashkent:microdistrict:chilanzar-1', 'microdistrict', 'uz:tashkent:chilanzar'],
    ['uz:tashkent:microdistrict:chilanzar-20', 'microdistrict', 'uz:tashkent:chilanzar'],
    ['uz:tashkent:microdistrict:yunusabad-4', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:microdistrict:yunusabad-5', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:microdistrict:yunusabad-19', 'microdistrict', 'uz:tashkent:yunusabad'],
    ['uz:tashkent:local-area:qorasuv', 'local_area', 'uz:tashkent:mirzo-ulugbek'],
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

  const qorasuv = getGeoEntity('uz:tashkent:local-area:qorasuv');
  assert.equal(qorasuv?.source, 'manual');
  assert.equal(qorasuv?.center?.lat, 41.333675);
  assert.equal(qorasuv?.center?.lng, 69.372236);
});

test('only TTZ-3 remains an unresolved Tashkent massif gap from this batch', () => {
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'TTZ-3' }),
    true,
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'TTZ-3' }),
    null,
  );

  for (const canonical of ['Sputnik', 'Karasu-6', 'Yunusabad-5']) {
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
