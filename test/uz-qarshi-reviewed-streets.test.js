import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['sheroziy', 'улица Шерозий', 38.841864, 65.8296104, 235629407],
  ['bunyodkor', 'улица Бунёдкор', 38.8461957, 65.7708107, 155762174],
  ['uzumzor', 'улица Узумзор', 38.8562318, 65.7712083, 230400140],
  ['mukumiy', 'улица Мукумий', 38.8637099, 65.8063091, 285017303],
  ['kum-kishlak', 'Кум Кишлак улица', 38.8473074, 65.8146891, 228236280],
  ['khalklar-dustligi', 'улица Халклар Дустлиги', 38.8493128, 65.832376, 559995933],
  ['koratepa', 'Коратепа улица', 38.8607177, 65.7751227, 316190401],
  ['korlugbogot', 'улица Корлугбогот', 38.8582066, 65.7886725, 1547224219],
  ['nuriston', 'улица Нуристон', 38.8416782, 65.7654283, 307314024],
  ['khusniobod', 'улица Хусниобод', 38.8548072, 65.8020941, 228236287],
  ['turkiston', 'улица Туркистон', 38.8637851, 65.801607, 228200961],
  ['buyuk-turan', 'Буюк Туран улица', 38.8265024, 65.7663884, 663960224],
  ['zhukovskogo', 'улица Жуковского', 38.8265898, 65.7774498, 239032070],
  ['margilon', 'улица Маргилон', 38.8843704, 65.7968895, 570289850],
  ['kurgantepa', 'улица Кургантепа', 38.8534636, 65.8284497, 293962886],
  ['khuzhabog', 'улица Хужабог', 38.8502161, 65.8001487, 243025782],
  ['zarafshon', 'улица Зарафшон', 38.8794209, 65.8014891, 307314687],
]);

test('reviewed Qarshi OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `uz:qarshi:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:qarshi', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('non-street Qarshi scrape hits remain excluded', () => {
  for (const id of [
    'uz:qarshi:street:karshi',
    'uz:qarshi:street:centralnyy-stadion',
    'uz:qarshi:street:karshi-international-airport',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
