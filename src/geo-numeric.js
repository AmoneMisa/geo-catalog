import { normalizeGeoAlias, geoAliasTokens } from './runtime-index.js';

/** Numbers inside geo names identify the place; they are not decoration.
 * "Chilanzar 7" and "Chilanzar 16" share every letter and differ in the one
 * token that says which quarter you mean. Lexical similarity alone scores them
 * as near-identical, so a fuzzy matcher will happily return the wrong one.
 *
 * These helpers classify tokens and compare the numeric evidence separately,
 * so a number conflict can veto a match no matter how similar the letters are.
 *
 * Known limitation: only digits count. An alias that spells its number out in
 * words ("Chilonzor yettinchi") reads as unnumbered and escapes the veto.
 * Teaching it numerals belongs in the lexicon's numeral vocabulary, not in
 * this digit-level comparison; there is a test pinning the current behaviour. */

export const TOKEN_KINDS = Object.freeze(['alpha', 'numeric', 'alphanumeric']);

const NUMERIC_RE = /^\d+$/u;
const ALPHA_RE = /^\p{L}+$/u;
/** A number with a letter suffix or prefix: "7a", "12b", "a1". The suffix is
 * as identifying as the digits -- block 7a is not block 7b. */
const ALPHANUMERIC_RE = /^(?=.*\d)(?=.*\p{L})[\p{L}\d]+$/u;

export function classifyGeoToken(token) {
  const value = String(token ?? '');
  if (NUMERIC_RE.test(value)) return 'numeric';
  if (ALPHA_RE.test(value)) return 'alpha';
  if (ALPHANUMERIC_RE.test(value)) return 'alphanumeric';
  return 'alpha';
}

/** Splits text into classified tokens. Numeric identity is read from the
 * numeric and alphanumeric tokens only. */
export function classifyGeoTokens(value) {
  const tokens = geoAliasTokens(normalizeGeoAlias(value)).map((token) => Object.freeze({ value: token, kind: classifyGeoToken(token) }));
  return Object.freeze({
    tokens: Object.freeze(tokens),
    alpha: Object.freeze(tokens.filter((token) => token.kind === 'alpha').map((token) => token.value)),
    numeric: Object.freeze(tokens.filter((token) => token.kind === 'numeric').map((token) => token.value)),
    alphanumeric: Object.freeze(tokens.filter((token) => token.kind === 'alphanumeric').map((token) => token.value)),
  });
}

/** "07" and "7" are the same quarter; "7a" and "7" are not. */
function identityOf(token) {
  if (NUMERIC_RE.test(token)) return String(Number(token));
  const digits = token.match(/\d+/u)?.[0];
  if (digits === undefined) return null;
  return `${Number(digits)}${token.replace(/\d+/u, '').toLocaleLowerCase('en-US')}`;
}

const identities = (classified) => new Set([...classified.numeric, ...classified.alphanumeric].map(identityOf).filter((value) => value !== null));

export const NUMERIC_CONFLICT_PENALTY = 1;
export const NUMERIC_MISSING_PENALTY = 0.35;

/**
 * Compares the numeric evidence in the text against the numbers an entity's
 * name requires.
 *
 * - `match`    — the text names at least one of the entity's numbers.
 * - `conflict` — the entity is numbered, the text is numbered, and they
 *                disagree. This is a veto, not a deduction: no amount of
 *                letter similarity makes Chilanzar 7 into Chilanzar 16.
 * - `absent`   — the entity is numbered but the text names no number. Not a
 *                contradiction, but the text has not identified which one, so
 *                it carries a penalty rather than full credit.
 * - `neutral`  — the entity carries no number, so there is nothing to check.
 *                Extra numbers in the text (a house number, a price) are not
 *                evidence against it.
 */
export function compareGeoNumerics(text, entityName) {
  const textTokens = classifyGeoTokens(text);
  const entityTokens = classifyGeoTokens(entityName);
  const wanted = identities(entityTokens);
  const found = identities(textTokens);
  if (!wanted.size) return Object.freeze({ status: 'neutral', compatible: true, penalty: 0, matched: Object.freeze([]), conflicting: Object.freeze([]) });
  const matched = [...wanted].filter((value) => found.has(value));
  if (matched.length) return Object.freeze({ status: 'match', compatible: true, penalty: 0, matched: Object.freeze(matched), conflicting: Object.freeze([]) });
  if (!found.size) return Object.freeze({ status: 'absent', compatible: true, penalty: NUMERIC_MISSING_PENALTY, matched: Object.freeze([]), conflicting: Object.freeze([]) });
  return Object.freeze({ status: 'conflict', compatible: false, penalty: NUMERIC_CONFLICT_PENALTY, matched: Object.freeze([]), conflicting: Object.freeze([...found]) });
}

/**
 * Whether `entity` may still be considered a match for `text`. A numbered
 * entity whose number the text contradicts is rejected outright; everything
 * else is left to the caller's own scoring, with `penalty` to fold in.
 *
 * Checks every alias, because an entity may be numbered in one spelling and
 * not another; the most favourable outcome wins, so an unnumbered alias can
 * legitimately match unnumbered text.
 */
export function verifyGeoNumericAgreement(text, entity) {
  const names = entity?.normalizedAliases?.length ? entity.normalizedAliases : [entity?.canonical].filter(Boolean);
  if (!names.length) return compareGeoNumerics(text, '');
  let best = null;
  for (const name of names) {
    const result = compareGeoNumerics(text, name);
    if (!best || result.penalty < best.penalty) best = result;
    if (best.penalty === 0) break;
  }
  return best;
}
