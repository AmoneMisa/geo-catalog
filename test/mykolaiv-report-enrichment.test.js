import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';

const owners = Object.freeze([
  ['ua:mykolaiv:microdistrict:pivnichnyi', 'way', 185143769],
  ['ua:mykolaiv:microdistrict:raketne-urochyshche', 'relation', 2474997],
  ['ua:mykolaiv:microdistrict:lisky', 'relation', 2521994],
  ['ua:mykolaiv:microdistrict:varvarivka', 'relation', 2416748],
  ['ua:mykolaiv:microdistrict:ternivka', 'relation', 7075007],
  ['ua:mykolaiv:microdistrict:kulbakyne', 'node', 1980719290],
  ['ua:mykolaiv:microdistrict:novyi-vodopii', 'relation', 2521722],
  ['ua:mykolaiv:microdistrict:velyka-korenykha', 'relation', 2535311],
  ['ua:mykolaiv:microdistrict:mala-korenykha', 'relation', 2454923],
  ['ua:mykolaiv:microdistrict:pivdennyi-turbinnyi-zavod', 'relation', 2521750],
  ['ua:mykolaiv:residential-complex:riviera', 'way', 1227154323],
  ['ua:mykolaiv:residential-complex:grand-deluxe', 'way', 198061398],
  ['ua:mykolaiv:residential-complex:premier-house', 'way', 1232175621],
  ['ua:mykolaiv:residential-complex:pivnichna-zirka', 'way', 1230303386],
  ['ua:mykolaiv:street:levanevtsiv', 'way', 185645173],
  ['ua:mykolaiv:street:flotskyi-boulevard', 'way', 143461027],
  ['ua:mykolaiv:street:naberezhna', 'way', 194092743],
  ['ua:mykolaiv:poi:inhulskyi-bridge', 'way', 52136681],
]);

test('Mykolaiv uploaded report owners are retained with physical OSM identity', () => {
  for (const [id, osmType, osmId] of owners) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.deepEqual(entity.osm, { type: osmType, id: osmId }, id);
  }
});

test('Mykolaiv administrative districts keep sole ownership of their OSM relations', () => {
  assert.equal(getGeoEntity('ua:mykolaiv:district:inhulskyi')?.osm?.id, 2523802);
  assert.equal(getGeoEntity('ua:mykolaiv:district:korabelnyi')?.osm?.id, 2523805);
  assert.equal(getGeoEntity('ua:mykolaiv:microdistrict:inhulskyi'), null);
  assert.equal(getGeoEntity('ua:mykolaiv:microdistrict:korabelnyi'), null);
});
