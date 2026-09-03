import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGeoEntity,
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

const rows = [
  ['Ahmad Yugnakiy', 'ahmad-yugnakiy', 'uz:tashkent:mirzo-ulugbek', 41.348643, 69.384426],
  ['Traktorsozlar', 'traktorsozlar', 'uz:tashkent:mirzo-ulugbek', 41.356488, 69.389268],
  ['Yangi Choshtepa', 'yangi-choshtepa', 'uz:tashkent:yangihayot', 41.23134, 69.192322],
  ['Olimpiya', 'olimpiya', 'uz:tashkent:almazar', 41.362553, 69.196256],
  ['Gulobod', 'gulobod', 'uz:tashkent:shaykhantahur', 41.327208, 69.22538],
  ['Sebzor', 'sebzor', 'uz:tashkent:almazar', 41.333979, 69.248781],
  ['Qalqon', 'qalqon', 'uz:tashkent:yashnobod', 41.280806, 69.371535],
  ['Humoyun', 'humoyun', 'uz:tashkent:mirzo-ulugbek', 41.343891, 69.388055],
  ['Asalobod', 'asalobod', 'uz:tashkent:yashnobod', 41.2818125, 69.3364375],
];

test('verified Tashkent mahalla map objects resolve as manual approximate centers', () => {
  for (const [canonical, slug, parentId, lat, lng] of rows) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical };
    const entity = resolveLexiconGeoEntity(input);

    assert.equal(entity?.id, `uz:tashkent:mahalla:${slug}`, canonical);
    assert.equal(entity?.parentId, parentId, canonical);
    assert.deepEqual(entity?.center, { lat, lng }, canonical);
    assert.equal(entity?.source, 'manual', canonical);
    assert.equal(entity?.accuracy, 'approximate', canonical);
    assert.equal(entity?.osm, undefined, canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }
});

test('Chamanbog keeps a distinct conservative mahalla owner', () => {
  const input = { country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical: "Chamanbog'" };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(entity?.id, 'uz:tashkent:mahalla:chamanbog');
  assert.equal(entity?.parentId, 'uz:tashkent:almazar');
  assert.deepEqual(entity?.center, { lat: 41.3690631, lng: 69.1942643 });
  assert.equal(entity?.source, 'manual');
  assert.equal(entity?.accuracy, 'approximate');
  assert.equal(entity?.osm, undefined);
  assert.equal(isGeoCoverageGap(input), false);
});

test('same-name mahalla and local-area entities retain separate spatial ownership', () => {
  for (const slug of ['ahmad-yugnakiy', 'humoyun', 'olimpiya', 'gulobod', 'sebzor', 'qalqon']) {
    const mahalla = getGeoEntity(`uz:tashkent:mahalla:${slug}`);
    const area = getGeoEntity(`uz:tashkent:local-area:${slug}`);

    assert.ok(mahalla, slug);
    assert.ok(area, slug);
    assert.notEqual(mahalla.id, area.id, slug);
    assert.equal(mahalla.osm, undefined, slug);
  }
});
