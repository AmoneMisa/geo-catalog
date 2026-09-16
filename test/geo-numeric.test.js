import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyGeoToken, classifyGeoTokens, compareGeoNumerics, verifyGeoNumericAgreement,
  NUMERIC_CONFLICT_PENALTY, NUMERIC_MISSING_PENALTY, TOKEN_KINDS,
} from '../src/geo-numeric.js';

test('tokens are classified as alpha, numeric or alphanumeric', () => {
  assert.equal(classifyGeoToken('chilanzar'), 'alpha');
  assert.equal(classifyGeoToken('чиланзар'), 'alpha');
  assert.equal(classifyGeoToken('7'), 'numeric');
  assert.equal(classifyGeoToken('07'), 'numeric');
  assert.equal(classifyGeoToken('7a'), 'alphanumeric');
  assert.equal(classifyGeoToken('a1'), 'alphanumeric');
  for (const kind of [classifyGeoToken('x'), classifyGeoToken('1'), classifyGeoToken('x1')]) assert.ok(TOKEN_KINDS.includes(kind));
});

test('text is split into its alpha, numeric and alphanumeric parts', () => {
  const classified = classifyGeoTokens('Чиланзар 7 квартал, дом 12а');
  assert.deepEqual([...classified.alpha], ['чиланзар', 'квартал', 'дом']);
  assert.deepEqual([...classified.numeric], ['7']);
  assert.deepEqual([...classified.alphanumeric], ['12а']);
  assert.equal(classified.tokens.length, 5);
});

test('the identifying number must agree', () => {
  const agreeing = compareGeoNumerics('Чиланзар 7 квартал', 'чиланзар 7');
  assert.equal(agreeing.status, 'match');
  assert.equal(agreeing.compatible, true);
  assert.equal(agreeing.penalty, 0);
});

test('Chilanzar-7 never matches Chilanzar-16', () => {
  // The whole point of the stage: these differ by one token and are lexically
  // near-identical, so similarity alone would call them the same place.
  const conflict = compareGeoNumerics('Чиланзар 7 квартал', 'чиланзар 16');
  assert.equal(conflict.status, 'conflict');
  assert.equal(conflict.compatible, false, 'a number conflict is a veto, not a deduction');
  assert.equal(conflict.penalty, NUMERIC_CONFLICT_PENALTY);
  assert.deepEqual([...conflict.conflicting], ['7']);
});

test('leading zeros do not make a different quarter', () => {
  assert.equal(compareGeoNumerics('Чиланзар 07', 'чиланзар 7').status, 'match');
  assert.equal(compareGeoNumerics('quarter 007', 'quarter 7').status, 'match');
});

test('a letter suffix is as identifying as the digits', () => {
  assert.equal(compareGeoNumerics('block 7a', 'block 7a').status, 'match');
  assert.equal(compareGeoNumerics('block 7a', 'block 7b').status, 'conflict');
  assert.equal(compareGeoNumerics('block 7a', 'block 7').status, 'conflict', '7a is not 7');
});

test('an unnumbered entity is never vetoed by numbers in the text', () => {
  const neutral = compareGeoNumerics('Shifokorlar Street 42', 'shifokorlar street');
  assert.equal(neutral.status, 'neutral');
  assert.equal(neutral.compatible, true);
  assert.equal(neutral.penalty, 0, 'a house number is not evidence against a street');
});

test('a numbered entity with no number in the text is penalised, not rejected', () => {
  const absent = compareGeoNumerics('Чиланзар квартал', 'чиланзар 7');
  assert.equal(absent.status, 'absent');
  assert.equal(absent.compatible, true, 'the text simply did not say which one');
  assert.equal(absent.penalty, NUMERIC_MISSING_PENALTY);
  assert.ok(absent.penalty < NUMERIC_CONFLICT_PENALTY, 'silence must cost less than contradiction');
});

test('the text naming several numbers matches if any is the right one', () => {
  assert.equal(compareGeoNumerics('Чиланзар 7, дом 16', 'чиланзар 7').status, 'match');
  assert.equal(compareGeoNumerics('Чиланзар 16, дом 7', 'чиланзар 7').status, 'match');
});

test('empty input is neutral rather than a conflict', () => {
  assert.equal(compareGeoNumerics('', '').status, 'neutral');
  assert.equal(compareGeoNumerics('', 'чиланзар 7').status, 'absent');
  assert.equal(compareGeoNumerics('чиланзар 7', '').status, 'neutral');
});

test('an entity is verified against its most favourable alias', () => {
  const entity = { normalizedAliases: ['chilonzor 7', 'chilanzar 7'] };
  assert.equal(verifyGeoNumericAgreement('Chilanzar 7 kvartal', entity).status, 'match');
  assert.equal(verifyGeoNumericAgreement('Chilanzar 16 kvartal', entity).status, 'conflict');
});

test('a number spelled out in words is not yet treated as a number', () => {
  // Known limitation, asserted so it is a decision rather than a surprise:
  // "yettinchi" is Uzbek for seventh, but it carries no digits, so that alias
  // is unnumbered and escapes the veto. Fixing it belongs in the lexicon's
  // numeral vocabulary, not in this digit-level comparison.
  const entity = { normalizedAliases: ['chilonzor yettinchi'] };
  assert.equal(verifyGeoNumericAgreement('Chilanzar 16 kvartal', entity).status, 'neutral');
});

test('an unnumbered alias lets unnumbered text match', () => {
  // A quarter listed both as "Chilonzor 7" and plainly as "Chilonzor" should
  // still match text that names no number, via the unnumbered spelling.
  const entity = { normalizedAliases: ['chilonzor 7', 'chilonzor'] };
  assert.equal(verifyGeoNumericAgreement('Chilonzor', entity).status, 'neutral');
  assert.equal(verifyGeoNumericAgreement('Chilonzor 16', entity).status, 'neutral', 'the unnumbered alias is not contradicted');
});

test('verification falls back to the canonical name when there are no aliases', () => {
  assert.equal(verifyGeoNumericAgreement('Chilanzar 16', { canonical: 'Chilanzar 7' }).status, 'conflict');
  assert.equal(verifyGeoNumericAgreement('anything', {}).status, 'neutral');
});
