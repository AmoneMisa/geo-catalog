import { normalizeGeoAlias } from './runtime-index.js';

/** Transliteration for *retrieval only*.
 *
 * "Tashkent" and "Toshkent" are the same city; "Chilanzar" and "Chilonzor" the
 * same district; "Алматы" and "Almaty" the same place. Exact and token
 * matching miss all three, because the spellings differ in script and in which
 * vowels the transliterator chose.
 *
 * A skeleton collapses those differences so one lookup finds all spellings. It
 * is deliberately lossy and will group places that are genuinely different --
 * that is acceptable because nothing here decides a match. A skeleton hit only
 * proposes a candidate; the caller must still verify it the normal way. */

/** Cyrillic to Latin, covering Russian, Ukrainian, Uzbek Cyrillic and Kazakh.
 * Multi-character values are intentional: щ really is four Latin letters. */
const CYRILLIC = Object.freeze({
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
  // Ukrainian
  є: 'ye', і: 'i', ї: 'yi', ґ: 'g',
  // Uzbek Cyrillic
  ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
  // Kazakh
  ә: 'a', ө: 'o', ұ: 'u', ү: 'u', һ: 'h', ң: 'n', і: 'i',
});

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

export function transliterateToLatin(value) {
  let out = '';
  for (const char of String(value ?? '').toLocaleLowerCase('en-US')) out += CYRILLIC[char] ?? char;
  return out;
}

/** Spelling variants that survive transliteration but mean the same sound. */
function canonicalizeLatin(value) {
  return value
    .replace(/kh/gu, 'h')
    .replace(/x/gu, 'h')
    // Uzbek q and Russian-derived k spell the same sound in place names:
    // Samarqand/Samarkand, Qarshi/Karshi.
    .replace(/q/gu, 'k')
    .replace(/ts/gu, 's')
    .replace(/cz/gu, 'ch')
    .replace(/j(?=[aou])/gu, 'y')
    .replace(/w/gu, 'v')
    .replace(/(.)\1+/gu, '$1');
}

/**
 * Retrieval skeleton: transliterated, sound-canonicalized, vowels dropped
 * after the first character.
 *
 * Vowels are where transliterations disagree most (Tashkent/Toshkent,
 * Chilanzar/Chilonzor), so removing them is what makes the variants meet. The
 * first character is kept whatever it is, so "Almaty" and "Олмаати" still
 * agree on where the word starts and unrelated words beginning differently do
 * not collide.
 */
export function geoSkeleton(value) {
  const normalized = normalizeGeoAlias(transliterateToLatin(value));
  if (!normalized) return '';
  return normalized.split(' ').map((word) => {
    const canonical = canonicalizeLatin(word);
    if (!canonical) return '';
    let out = canonical[0];
    for (const char of canonical.slice(1)) if (!VOWELS.has(char)) out += char;
    return out;
  }).filter(Boolean).join(' ');
}

/** Every distinct skeleton an entity answers to. */
export function geoSkeletonsOf(entity) {
  const names = entity?.normalizedAliases?.length ? entity.normalizedAliases : [entity?.canonical].filter(Boolean);
  return [...new Set(names.map(geoSkeleton).filter(Boolean))];
}

/** Skeleton index over runtime entities. Buckets can be large by design, so a
 * caller should treat a hit as "worth verifying", never as an answer. */
export function buildSkeletonIndex(entities) {
  const index = new Map();
  for (const entity of entities ?? []) {
    for (const skeleton of geoSkeletonsOf(entity)) {
      const bucket = index.get(skeleton);
      if (bucket) bucket.push(entity.entityId); else index.set(skeleton, [entity.entityId]);
    }
  }
  for (const [key, ids] of index) index.set(key, Object.freeze([...new Set(ids)]));
  return index;
}
