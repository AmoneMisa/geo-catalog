import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGeoRuntimeIndex } from '../src/runtime-index.js';
import { resolveGeoText, MATCH_TIERS } from '../src/tiered-matching.js';

const entity = (id, type, canonicalName, extra = {}) => ({ id, type, canonicalName, country: 'UZ', center: { lat: 41, lng: 69 }, ...extra });

const index = buildGeoRuntimeIndex([
  entity('city', 'city', 'Toshkent', { sourceNames: { ru: ['Ташкент'] } }),
  entity('chilonzor-7', 'microdistrict', 'Chilonzor 7', { parentId: 'city' }),
  entity('chilonzor-16', 'microdistrict', 'Chilonzor 16', { parentId: 'city' }),
  entity('shifokorlar', 'street', 'Shifokorlar Street', { parentId: 'city' }),
  entity('amir-temur', 'street', 'Amir Temur Avenue', { parentId: 'city' }),
]);

const resolve = (text, options) => resolveGeoText(text, index, options);

test('the tier list is the escalation order the stage specifies', () => {
  assert.deepEqual([...MATCH_TIERS], ['structured', 'exact', 'indexed', 'skeleton', 'fuzzy', 'unresolved']);
});

test('tier 0 short-circuits on a structured id', () => {
  const found = resolve('anything at all', { entityId: 'shifokorlar' });
  assert.equal(found.tier, 'structured');
  assert.equal(found.entityId, 'shifokorlar');
  assert.equal(found.trace.length, 1, 'no other tier is consulted');
});

test('an unknown structured id falls through instead of being trusted', () => {
  assert.notEqual(resolve('Shifokorlar Street', { entityId: 'nope' }).tier, 'structured');
});

test('tier 1 resolves an exact alias without touching later tiers', () => {
  const found = resolve('Shifokorlar Street');
  assert.equal(found.tier, 'exact');
  assert.equal(found.entityId, 'shifokorlar');
  assert.deepEqual(found.trace.map((step) => step.tier), ['exact']);
});

test('tier 2 resolves from token evidence when there is no exact alias', () => {
  const found = resolve('Shifokorlar');
  assert.equal(found.tier, 'indexed');
  assert.equal(found.entityId, 'shifokorlar');
  assert.ok(found.trace.some((step) => step.tier === 'exact'), 'it tried the cheaper tier first');
});

test('tier 3 resolves a transliterated spelling', () => {
  const found = resolve('Ташкент город');
  assert.ok(['indexed', 'skeleton'].includes(found.tier), `resolved at ${found.tier}`);
  assert.equal(found.entityId, 'city');
});

test('a cross-script spelling with no exact alias reaches the skeleton tier', () => {
  const found = resolve('Chilanzar 7');
  assert.equal(found.entityId, 'chilonzor-7', 'Chilanzar must find Chilonzor');
  assert.ok(['skeleton', 'fuzzy', 'indexed'].includes(found.tier));
});

test('a numeric conflict is rejected at every tier', () => {
  // Chilanzar 16 must never resolve to Chilonzor 7 however it was retrieved.
  const found = resolve('Chilanzar 16');
  assert.notEqual(found.entityId, 'chilonzor-7');
  assert.ok(found.entityId === 'chilonzor-16' || found.entityId === null, `got ${found.entityId}`);
});

test('a vowel typo is caught by the cheaper skeleton tier', () => {
  // The skeleton drops vowels, so vowel typos never need fuzzy scoring. This
  // is the escalation working: tier 4 is reached less often than expected.
  const found = resolve('Shifokorlr Streat');
  assert.equal(found.entityId, 'shifokorlar');
  assert.equal(found.tier, 'skeleton');
});

test('a consonant typo falls through to the bounded fuzzy tier', () => {
  const twins = buildGeoRuntimeIndex([
    entity('street', 'street', 'Bahoriston Street'),
    entity('avenue', 'street', 'Bahoriston Avenue'),
  ]);
  const found = resolveGeoText('Bahoriston Streek', twins);
  assert.equal(found.tier, 'fuzzy', 'a changed consonant survives the skeleton');
  assert.equal(found.entityId, 'street');
  assert.ok(found.score >= 0.82);
});

test('text matching nothing is unresolved rather than forced', () => {
  const found = resolve('completely unrelated words here');
  assert.equal(found.tier, 'unresolved');
  assert.equal(found.entityId, null);
});

test('fuzzy never scores the whole catalogue', () => {
  const found = resolve('zzzz qqqq wwww');
  assert.equal(found.tier, 'unresolved');
  assert.equal(found.candidateCount, 0, 'nothing was proposed, so nothing was scored');
  const fuzzyStep = found.trace.find((step) => step.tier === 'fuzzy');
  assert.equal(fuzzyStep.candidates, 0);
});

test('a tier proposing too many candidates is capped', () => {
  const crowd = Array.from({ length: 200 }, (_, i) => entity(`s${i}`, 'street', `Common Road ${i}`));
  const wide = buildGeoRuntimeIndex(crowd, { tokenLimit: 1000, rareLimit: 1000 });
  const found = resolveGeoText('Common Road', wide, { maxCandidates: 10 });
  const indexedStep = found.trace.find((step) => step.tier === 'indexed');
  assert.ok(indexedStep.candidates <= 10, `expected at most 10 candidates, got ${indexedStep.candidates}`);
});

test('two equally good candidates stay unresolved rather than picking one', () => {
  const twins = buildGeoRuntimeIndex([
    entity('a', 'street', 'Bahor Street'),
    entity('b', 'street', 'Bahar Street'),
  ]);
  const found = resolveGeoText('Bahur Street', twins);
  assert.equal(found.tier, 'unresolved');
  assert.ok(found.ambiguous.length >= 2, 'the rivals are reported');
});

test('empty input resolves to nothing without throwing', () => {
  for (const value of ['', null, '   ']) {
    const found = resolve(value);
    assert.equal(found.tier, 'unresolved');
    assert.equal(found.entityId, null);
  }
});

test('the trace shows the escalation actually taken', () => {
  const exact = resolve('Amir Temur Avenue');
  assert.deepEqual(exact.trace.map((step) => step.tier), ['exact']);
  const deep = resolve('Shifokorlr Streat');
  assert.deepEqual(deep.trace.map((step) => step.tier), ['exact', 'indexed', 'skeleton'], 'it stopped as soon as a tier answered');
  const deepest = resolve('completely unrelated words here');
  assert.deepEqual(deepest.trace.map((step) => step.tier), ['exact', 'indexed', 'skeleton', 'fuzzy', 'unresolved']);
});
