import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['abdulaziza-yuldasheva', 'улица Абдулазиза Юлдашева', 40.7480376, 72.3237085, 27635565],
  ['tinchlik', 'Тинчлик улица', 40.7655951, 72.3383246, 123632275],
  ['atabekova', 'улица Атабекова', 40.8113274, 72.321776, 853545426],
  ['t-keldieva', 'улица Т. Келдиева', 40.7890042, 72.3245108, 123632874],
  ['shabnam', 'улица Шабнам', 40.7539627, 72.3488442, 343902025],
  ['toklik', 'улица Токлик', 40.7892982, 72.3363177, 1218935280],
  ['abduraufa-fitrata', 'улица Абдурауфа Фитрата', 40.7759645, 72.3508932, 27154544],
  ['obikhayot', 'улица Обихаёт', 40.7838467, 72.3617989, 123632268],
  ['damarik', 'улица Дамарик', 40.7954394, 72.3664466, 1354614424],
  ['khursandlik', 'улица Хурсандлик', 40.762625, 72.3266841, 1532186712],
  ['iftikhor', 'улица Ифтихор', 40.7640507, 72.3400438, 123632717],
  ['bakhouddina-nakshbandi', 'улица Бахоуддина Накшбанди', 40.7506781, 72.364144, 1123713897],
  ['sarbontepa', 'Сарбонтепа улица', 40.7765684, 72.3148511, 1532166195],
  ['saidy-zunnunovoy', 'улица Саиды Зуннуновой', 40.7735815, 72.3131705, 123635130],
]);

test('reviewed Andijan OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `uz:andijan:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:andijan', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('nearby non-Andijan street hits remain excluded', () => {
  for (const id of [
    'uz:andijan:street:s-zunnunova',
    'uz:andijan:street:dustlik',
    'uz:andijan:street:dalvarzin',
    'uz:andijan:street:gumbaz',
    'uz:andijan:street:farhod',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
