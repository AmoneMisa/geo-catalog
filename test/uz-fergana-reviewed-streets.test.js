import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['kuvasayskaya', 'Кувасайская улица', 40.3591543, 71.833952, 775162618],
  ['konstitutsii', 'улица Конституции', 40.3835871, 71.7857042, 84225411],
  ['nikhol', 'улица Нихол', 40.3462157, 71.8069033, 923732557],
  ['belova', 'улица Белова', 40.3821944, 71.8392414, 172053175],
  ['voris', 'улица Ворис', 40.3704415, 71.8353731, 171374697],
  ['guliston', 'улица Гулистон', 40.3566278, 71.8326908, 1472007836],
  ['binafsha', 'улица Бинафша', 40.3662263, 71.8392361, 1530544995],
  ['yangi-khayot', 'улица Янги Хаёт', 40.3875309, 71.8273477, 172053150],
]);

test('reviewed Fergana OSM streets retain exact way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `uz:fergana:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UZ', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'uz:fergana', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('Margilan and POI hits from Fergana scrape remain excluded', () => {
  for (const id of [
    'uz:fergana:street:kurkam',
    'uz:fergana:street:mashal',
    'uz:fergana:street:fergana-davlat-universiteti',
    'uz:fergana:street:fergana-international-airport',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
