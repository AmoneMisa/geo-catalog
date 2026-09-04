import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:karakol:street:yu-abdrakhmanova', 'Улица Ю. Абдрахманова', 27427286],
  ['kg:karakol:street:arychnaya', 'Арычная улица', 178785649],
  ['kg:karakol:street:n-aitmatovoy', 'Улица Н. Айтматовой', 446571699],
  ['kg:karakol:street:konkina', 'Улица Конкина', 803847586],
  ['kg:karakol:street:koshevogo', 'Улица Кошевого', 400042020],
  ['kg:karakol:street:kyshtobaeva', 'Улица Кыштобаева', 220766288],
  ['kg:karakol:street:michurina', 'Улица Мичурина', 182091982],
  ['kg:karakol:street:molodezhnaya', 'Молодёжная улица', 243569007],
  ['kg:karakol:street:moskovskaya', 'Московская улица', 178785680],
  ['kg:karakol:street:sadybekova', 'Улица Садыбекова', 178823537],
  ['kg:karakol:street:shapak-baatyra', 'Улица Шапак-баатыра', 220868237],
  ['kg:karakol:street:stalingradskaya', 'Сталинградская улица', 220868238],
  ['kg:karakol:street:voroshilova', 'Улица Ворошилова', 220868257],
  ['kg:karakol:street:zhakshylyk', 'Улица Жакшылык', 220868245],
]);

test('reviewed Karakol streets expose canonical OSM-backed entities', () => {
  for (const [id, canonicalName, osmId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, 'street');
    assert.equal(entity.parentId, 'kg:karakol');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'way', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`);
  }
});
