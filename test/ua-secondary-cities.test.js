import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';

test('verified secondary Ukrainian city centers use their OSM named-place nodes', () => {
  const expected = new Map([
    ['ua:kamianske', [{ lat: 48.5168, lng: 34.6069 }, 1756064253]],
    ['ua:nikopol', [{ lat: 47.5692, lng: 34.3917 }, 265058407]],
    ['ua:pavlohrad', [{ lat: 48.5317, lng: 35.8704 }, 265059962]],
    ['ua:kamianets-podilskyi', [{ lat: 48.6781, lng: 26.5854 }, 268081010]],
    ['ua:drohobych', [{ lat: 49.3514, lng: 23.5062 }, 313248206]],
    ['ua:stryi', [{ lat: 49.2559, lng: 23.8531 }, 247880583]],
    ['ua:kolomyia', [{ lat: 48.5259, lng: 25.0381 }, 284716726]],
    ['ua:kalush', [{ lat: 49.0289, lng: 24.3613 }, 312270776]],
    ['ua:fastiv', [{ lat: 50.07993, lng: 29.91628 }, 337535126]],
    ['ua:vasylkiv', [{ lat: 50.17814, lng: 30.3175 }, 337527490]],
  ]);

  for (const [id, [center, nodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'node', id: nodeId }, id);
  }
});
