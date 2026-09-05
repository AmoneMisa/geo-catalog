import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const osmCases = Object.freeze([
  ['5b-mikroraion', '5Б микрорайон', 39.7465498, 64.4128903, 3593587411],
  ['5v-mikroraion', '5В микрорайон', 39.74566, 64.4060994, 3593587413],
  ['6a-mikroraion', '6A микрорайон', 39.7376035, 64.4398669, 3593587414],
  ['6b-mikroraion', '6Б микрорайон', 39.7372975, 64.4309026, 3593587415],
  ['severnyy', 'Северный микрорайон', 39.7834957, 64.4442455, 3593630430],
]);

test('reviewed Bukhara microdistricts retain exact OSM node provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of osmCases) {
    const id = `uz:bukhara:microdistrict:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'microdistrict', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:bukhara', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/node/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'node', id: osmId }, id);
  }
});

test('reviewed Safedmuy living area keeps its 2GIS source', () => {
  const entity = getGeoEntity('uz:bukhara:local-area:safedmuy');
  assert.ok(entity);
  assert.equal(entity.type, 'local_area');
  assert.equal(entity.canonicalName, 'Жилмассив Сафедмуй');
  assert.deepEqual(entity.center, { lat: 39.735984, lng: 64.421174 });
  assert.equal(entity.source, 'manual');
  assert.equal(entity.sourceUrl, 'https://2gis.uz/bukhara/geo/70030076739476399');
});

test('Bukhara review noise is not promoted as area owners', () => {
  for (const id of [
    'uz:bukhara:district:bukhara-international-airport',
    'uz:bukhara:microdistrict:bukhara-state-university',
    'uz:bukhara:local-area:1-y-2-go-massiva-ulitsy-shaykhon',
    'uz:bukhara:local-area:mavze',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
