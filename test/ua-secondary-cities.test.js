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
    ['ua:boyarka', [{ lat: 50.33567, lng: 30.28476 }, 36507632]],
    ['ua:pereiaslav', [{ lat: 50.0644, lng: 31.44473 }, 337535557]],
    ['ua:chuhuiv', [{ lat: 49.83663, lng: 36.68994 }, 264282090]],
    ['ua:lozova', [{ lat: 48.8842, lng: 36.316 }, 337581295]],
    ['ua:izium', [{ lat: 49.19132, lng: 37.27841 }, 337568004]],
    ['ua:kupiansk', [{ lat: 49.7133, lng: 37.6142 }, 337548383]],
    ['ua:merefa', [{ lat: 49.81834, lng: 36.06287 }, 1685829433]],
    ['ua:liubotyn', [{ lat: 49.94356, lng: 35.91852 }, 337539733]],
    ['ua:chornomorsk', [{ lat: 46.3013, lng: 30.6549 }, 337690843]],
    ['ua:bilhorod-dnistrovskyi', [{ lat: 46.191, lng: 30.3458 }, 738536340]],
    ['ua:podilsk', [{ lat: 47.74974, lng: 29.5305 }, 337670266]],
  ]);

  for (const [id, [center, nodeId]] of expected) {
    const city = getGeoEntity(id);
    assert.equal(city?.source, 'osm', id);
    assert.equal(city?.accuracy, 'city', id);
    assert.deepEqual(city?.center, center, id);
    assert.deepEqual(city?.osm, { type: 'node', id: nodeId }, id);
  }
});
