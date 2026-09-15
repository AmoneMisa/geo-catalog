import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveLexiconGeoEntity, getGeoEntity } from '../src/index.js';
const corpus = JSON.parse(readFileSync(new URL('./fixtures/matching-baseline.json', import.meta.url), 'utf8'));
for (const fixture of corpus) {
  test(`matching baseline: ${fixture.id}`, () => {
    const result = resolveLexiconGeoEntity(fixture.input);
    assert.equal(result?.id ?? null, fixture.expected);
    if (result) assert.strictEqual(result, getGeoEntity(fixture.expected));
  });
}
