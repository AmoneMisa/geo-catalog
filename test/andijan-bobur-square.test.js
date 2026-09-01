import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';

test('Andijan Bobur Square resolves and is no longer an explicit gap', () => {
  const input = { country: 'UZ', city: 'Andijan', type: 'poi', canonical: 'Bobur Square' };
  const entity = resolveLexiconGeoEntity(input);

  assert.equal(isGeoCoverageGap(input), false);
  assert.equal(entity?.id, 'uz:andijan:poi:bobur-square');
  assert.equal(entity?.parentId, 'uz:andijan');
});

test('Andijan Bobur Square keeps official conservative provenance', () => {
  const entity = getGeoEntity('uz:andijan:poi:bobur-square');

  assert.deepEqual(entity?.center, { lat: 40.761746, lng: 72.351894 });
  assert.equal(entity?.source, 'official');
  assert.equal(entity?.accuracy, 'poi');
  assert.ok(entity?.accuracyM >= 160);
  assert.equal(entity?.osm, undefined);
});

test('Andijan enrichment keeps direct OSM area owners instead of same-name POIs and regional settlements', () => {
  const expected = [
    ['uz:andijan:mahalla:obod', 'mahalla', 'relation', 20515955],
    ['uz:andijan:mahalla:bobur', 'mahalla', 'relation', 20515947],
    ['uz:andijan:local-area:old-city', 'local_area', 'node', 5954037065],
    ['uz:andijan:local-area:north', 'local_area', 'way', 1504351223],
  ];

  for (const [id, type, osmType, osmId] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.parentId, 'uz:andijan');
    assert.equal(entity.type, type);
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: osmType, id: osmId });
  }
});

test('Andijan report-derived canonicals resolve through the existing lexicon bridge', () => {
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Andijan', type: 'mahalla', canonical: 'Obod' })?.id, 'uz:andijan:mahalla:obod');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Andijan', type: 'local_area', canonical: 'Bobur' })?.id, 'uz:andijan:mahalla:bobur');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Andijan', type: 'local_area', canonical: 'Old City' })?.id, 'uz:andijan:local-area:old-city');
  assert.equal(resolveLexiconGeoEntity({ country: 'UZ', city: 'Andijan', type: 'local_area', canonical: 'North' })?.id, 'uz:andijan:local-area:north');
});
