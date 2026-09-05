import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['a-dosnazarova', 'улица А. Досназарова', 42.4971351, 59.6077641, 1059363947],
  ['a-musaeva', 'улица А. Мусаева', 42.4513232, 59.6163937, 370061754],
  ['aybek', 'улица Айбек', 42.3776235, 59.6224403, 526181005],
  ['birlikli', 'улица Бирликли', 42.5204982, 59.6090498, 367758019],
  ['dashti-kypshak', 'улица Дашти кыпшак', 42.4163033, 59.602707, 424591749],
  ['gauir-kala', 'улица Гауир кала', 42.3828884, 59.6284137, 367757307],
  ['k-ayymbetova', 'улица К. Айымбетова', 42.490603, 59.6028637, 514937629],
  ['karakalpakstan', 'улица Каракалпакстан', 42.4571499, 59.5830439, 458699310],
  ['karuan-zholy', 'улица Каруан жолы', 42.4280392, 59.5970521, 367757447],
  ['kenimekh', 'улица Кенимех', 42.4697891, 59.5778419, 367757125],
  ['kos-kol-3', 'улица Кос кол-3', 42.4366904, 59.6484891, 407679844],
  ['mazhnuntal', 'улица Мажнунтал', 42.4387961, 59.623306, 443617378],
  ['nur-ata', 'улица Нур ата', 42.4823567, 59.5540431, 444708072],
  ['oraz-akhun', 'улица Ораз Ахун', 42.4112368, 59.6289684, 429486916],
  ['sakhra-guli', 'улица Сахра гули', 42.414218, 59.6119353, 424118056],
  ['salamatlyk', 'улица Саламатлык', 42.452476, 59.6373626, 384300961],
  ['shaglasyn', 'улица Шагласын', 42.3888802, 59.61772, 443606576],
  ['tabys', 'улица Табыс', 42.4958956, 59.6031841, 367758085],
  ['temir-zhol', 'улица Темир жол', 42.4061628, 59.6141387, 1093126064],
  ['ully-zhol', 'улица Уллы жол', 42.4543359, 59.6491791, 364772982],
]);

test('reviewed Nukus OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `uz:nukus:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:nukus', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('Nukus POI noise from street review remains excluded', () => {
  for (const id of [
    'uz:nukus:street:21-mkr-belyashi',
    'uz:nukus:street:jetour-nukus',
    'uz:nukus:street:kulturnyy-tsentr-3-tamasha',
    'uz:nukus:street:nukusskaya-semeynaya-poliklinika-9',
    'uz:nukus:street:nukusskiy-gosudarstvennyy-tekhnicheskiy-universitet',
    'uz:nukus:street:tekhnoxit-nukus',
    'uz:nukus:street:tsentr-sotsialnoy-sluzhby-insan-goroda-nukus',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
