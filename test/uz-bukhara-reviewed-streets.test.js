import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const mappedCases = Object.freeze([
  ['1-y-povorot-ulitsy-makhtumkuli', '1-й поворот улицы Махтумкули улица', 39.816222, 64.443509, '70030077005738328'],
  ['1-y-ulitsy-muborak', 'Улица 1-й улицы Муборак', 39.805897, 64.417944, '70030076847253265'],
  ['1-ya-ulitsa-khavzi-bodom', '1-я улица Хавзи Бодом', 39.774168, 64.401637, '70030076717674903'],
  ['1-ya-ulitsa-sheykhon', '1-я улица Шейхон', 39.815035, 64.42407, '70030076857236113'],
  ['2-ya-ulitsa-khavzi-bodom', '2-я улица Хавзи Бодом', 39.774694, 64.400623, '70030076717672474'],
]);

const osmCases = Object.freeze([
  ['chashmai-ayub', 'Чашмаи Аюб улица', 39.7789153, 64.4046196, 205823326],
  ['khafiza-sheraziya', 'улица Хафиза Шеразия', 39.7895839, 64.4023258, 201149195],
  ['marata-karimova', 'улица Марата Каримова', 39.7796663, 64.4059189, 1290035089],
  ['mirdustim', 'Мирдустим улица', 39.7743533, 64.4067019, 609341309],
  ['mukhtara-ashrafi', 'Мухтара Ашрафи улица', 39.777369, 64.4052448, 110280618],
  ['otabaya-eshanova', 'Отабая Эшанова улица', 39.7702272, 64.427349, 8151512],
  ['pistashikanon', 'Писташиканон улица', 39.7791802, 64.4038534, 113591052],
]);

test('reviewed Bukhara 2GIS streets retain exact frozen provenance', () => {
  for (const [slug, canonicalName, lat, lng, providerId] of mappedCases) {
    const id = `uz:bukhara:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:bukhara', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'manual', id);
    assert.equal(entity.sourceUrl, `https://2gis.uz/bukhara/geo/${providerId}`, id);
  }
});

test('reviewed Bukhara OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of osmCases) {
    const id = `uz:bukhara:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:bukhara', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('ambiguous and cross-city Bukhara street review records remain excluded', () => {
  for (const id of [
    'uz:bukhara:street:bukhara--geo-74d77e09fe',
    'uz:bukhara:street:bukhara--geo-a6ba2dd553',
    'uz:bukhara:street:namazgokh',
    'uz:bukhara:street:dvorets-emira-bukharskogo',
    'uz:bukhara:street:khokimiyat-goroda-kagan',
    'uz:bukhara:street:tsitadel-ark-bukhara',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
