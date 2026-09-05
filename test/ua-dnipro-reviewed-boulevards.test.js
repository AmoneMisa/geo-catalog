import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['bataliona-dnepr', 'Батальона «Днепр» бульвар', 48.4617712, 35.0215693, 652890049],
  ['slavy', 'Славы бульвар', 48.4116519, 35.0629973, 92495343],
  ['zvezdnyi', 'Звёздный бульвар', 48.4283115, 35.0173048, 345799643],
  ['teatralnyi', 'Театральный бульвар', 48.4674793, 35.0444704, 28351013],
  ['chernovola', 'Черновола бульвар', 48.4572697, 35.0111834, 680692237],
  ['kelnskii', 'Кельнський бульвар', 48.4610021, 35.0500527, 217643987],
]);

test('reviewed Dnipro boulevards retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:dnipro:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:dnipro', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('reviewed scrape does not replace the existing Naberezhna Peremohy owner', () => {
  const entity = getGeoEntity('ua:dnipro:street:naberezhna-peremohy');
  assert.ok(entity);
  assert.deepEqual(entity.osm, { type: 'way', id: 843985207 });
});
