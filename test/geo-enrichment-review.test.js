import test from 'node:test';
import assert from 'node:assert/strict';

import { createOsmPoiReview } from '../scripts/geo-enrichment-review.js';

const feature = (id, name, lng, lat) => ({
  properties: { osm_type: 'node', osm_id: id, tags: { amenity: 'school', name } },
  geometry: { type: 'Point', coordinates: [lng, lat] },
});

test('Geofabrik review JSON is deterministic, sorted and excludes existing physical entities', () => {
  const options = {
    country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent',
    collection: { type: 'FeatureCollection', features: [feature(2, 'Zeta School', 69.2, 41.3), feature(1, 'Alpha School', 69.1, 41.2)] },
    reviewed: [{ id: 'uz:tashkent:poi:alpha-school-n1', country: 'UZ', parentId: 'uz:tashkent', type: 'poi.school', canonicalName: 'Alpha School', osm: { type: 'node', id: 1 } }],
  };
  const review = createOsmPoiReview(options);
  assert.deepEqual(review.scope, { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  assert.equal(review.summary.additions, 1);
  assert.deepEqual(review.entities.map((entity) => entity.canonicalName), ['Zeta School']);
  assert.equal(JSON.stringify(review), JSON.stringify(createOsmPoiReview(options)));
});
