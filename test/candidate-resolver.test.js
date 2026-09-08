import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveGeoCatalogCandidates } from '../src/index.js';

test('catalog candidate resolver returns only city-scoped stable references', () => {
  const [mall] = resolveGeoCatalogCandidates({ country: 'UZ', city: 'Tashkent', query: 'Tashkent City Mall', types: ['poi.shopping_mall'] });
  assert.equal(mall.id, 'uz:tashkent:poi:tashkent-city-mall');
  assert.equal('center' in mall, false);
  assert.deepEqual(resolveGeoCatalogCandidates({ country: 'UA', city: 'Kyiv', query: 'Tashkent City Mall' }), []);
});
