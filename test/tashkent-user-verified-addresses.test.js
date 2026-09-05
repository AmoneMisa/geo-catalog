import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Shimoliy Olmazor Street 1 remains a building anchor, not a fake area center', () => {
  const address = getGeoEntity('uz:tashkent:address:shimoliy-olmazor-street-1');
  assert.ok(address);
  assert.equal(address.type, 'address');
  assert.equal(address.parentId, 'uz:tashkent:local-area:shimoliy-olmazor');
  assert.deepEqual(address.center, { lat: 41.341975, lng: 69.250793 });
  assert.equal(address.accuracy, 'building');
  assert.equal(address.sourceUrl, 'https://yandex.ru/maps/10335/tashkent/house/YkAYdAJgTkwEQFprfX91cHVkYQ==/');

  const area = resolveLexiconGeoEntity({
    country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shimoliy Olmazor',
  });
  assert.equal(area?.id, 'uz:tashkent:local-area:shimoliy-olmazor');
  assert.notDeepEqual(area?.center, address.center);
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Shimoliy Olmazor-1' }),
    true,
  );
});

test('Shifokorlar Street 6 remains a building anchor, not a fake numbered mavze center', () => {
  const address = getGeoEntity('uz:tashkent:address:shifokorlar-street-6');
  assert.ok(address);
  assert.equal(address.type, 'address');
  assert.equal(address.parentId, 'uz:tashkent:street:shifokorlar');
  assert.deepEqual(address.center, { lat: 41.356367, lng: 69.184192 });
  assert.equal(address.accuracy, 'building');
  assert.equal(address.accuracyM, 25);
  assert.equal(address.sourceUrl, 'https://yandex.ru/maps/10335/tashkent/house/YkAYdwBpQEIHQFprfX93c39jZg==/');
});

test('Shifokorlar evidence does not collapse numbered mavzes onto street or house points', () => {
  const street = getGeoEntity('uz:tashkent:street:shifokorlar');
  const medgorodok = resolveLexiconGeoEntity({
    country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Medgorodok',
  });
  const mahalla = resolveLexiconGeoEntity({
    country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: 'Shifokorlar',
  });

  assert.equal(street?.parentId, 'uz:tashkent:almazar');
  assert.ok(medgorodok);
  assert.equal(medgorodok?.parentId, 'uz:tashkent:almazar');
  assert.ok(mahalla);
  assert.equal(mahalla?.parentId, 'uz:tashkent:almazar');

  for (const canonical of ['Shifokorlar-5', 'Shifokorlar-6']) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical }),
      true,
      canonical,
    );
    assert.equal(
      resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical }),
      null,
      canonical,
    );
  }
});
