import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isGeoCoverageGap,
  resolveLexiconGeoEntity,
} from '../src/index.js';

const resolvedAreas = Object.freeze([
  ['Gulobod', 'uz:tashkent:local-area:gulobod', 'uz:tashkent:shaykhantahur', 'way', 144061796],
  ['Sebzor', 'uz:tashkent:local-area:sebzor', 'uz:tashkent:almazar', 'way', 32593826],
  ['Olimpiya', 'uz:tashkent:local-area:olimpiya', 'uz:tashkent:almazar', 'way', 1146998118],
  ["Chamanbog'", 'uz:tashkent:local-area:chamanbog', 'uz:tashkent:almazar', 'way', 1150374391],
  ['Feruza-2', 'uz:tashkent:local-area:feruza-2', 'uz:tashkent:mirzo-ulugbek', 'node', 1868216236],
  ['Feruza-3', 'uz:tashkent:local-area:feruza-3', 'uz:tashkent:mirzo-ulugbek', 'way', 151576922],
  ["Beshqo'rg'on-1", 'uz:tashkent:local-area:beshqorgon-1', 'uz:tashkent:almazar', 'node', 1866058465],
  ["Beshqo'rg'on-2", 'uz:tashkent:local-area:beshqorgon-2', 'uz:tashkent:almazar', 'node', 1866058473],
  ["Beshqo'rg'on-3", 'uz:tashkent:local-area:beshqorgon-3', 'uz:tashkent:almazar', 'node', 1866058478],
  ["Beshqo'rg'on-4", 'uz:tashkent:local-area:beshqorgon-4', 'uz:tashkent:almazar', 'way', 149508411],
  ['Quruvchi', 'uz:tashkent:local-area:quruvchi', 'uz:tashkent:sergeli', 'way', 141913622],
  ["Qo'yliq-1", 'uz:tashkent:local-area:qoyliq-1', 'uz:tashkent:mirobod', 'node', 3991877003],
  ["Qo'yliq-2", 'uz:tashkent:local-area:qoyliq-2', 'uz:tashkent:mirobod', 'node', 3991877004],
  ["Qo'yliq-7", 'uz:tashkent:local-area:qoyliq-7', 'uz:tashkent:sergeli', 'node', 5637605369],
]);

test('verified Tashkent local areas resolve to their exact OSM owners', () => {
  for (const [canonical, id, parentId, osmType, osmId] of resolvedAreas) {
    const input = { country: 'UZ', city: 'Tashkent', type: 'local_area', canonical };
    const entity = resolveLexiconGeoEntity(input);

    assert.equal(entity?.id, id, canonical);
    assert.equal(entity?.parentId, parentId, canonical);
    assert.deepEqual(entity?.osm, { type: osmType, id: osmId }, canonical);
    assert.equal(entity?.source, 'osm', canonical);
    assert.equal(isGeoCoverageGap(input), false, canonical);
  }
});

test('same-name Tashkent mahallas remain independent spatial gaps', () => {
  for (const canonical of ['Gulobod', "Chamanbog'", 'Olimpiya', 'Sebzor']) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical }),
      true,
      canonical,
    );
  }
});
