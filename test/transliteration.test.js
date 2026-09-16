import test from 'node:test';
import assert from 'node:assert/strict';
import { transliterateToLatin, geoSkeleton, geoSkeletonsOf, buildSkeletonIndex } from '../src/transliteration.js';

const same = (a, b) => assert.equal(geoSkeleton(a), geoSkeleton(b), `${a} and ${b} should share a skeleton (${geoSkeleton(a)} vs ${geoSkeleton(b)})`);

test('Cyrillic transliterates to Latin', () => {
  assert.equal(transliterateToLatin('Ташкент'), 'tashkent');
  assert.equal(transliterateToLatin('Алматы'), 'almati');
  assert.equal(transliterateToLatin('Чиланзар'), 'chilanzar');
  // Character-wise, so ї becomes "yi": the official romanization is "Kyiv",
  // but retrieval only needs the skeletons to meet, which they do.
  assert.equal(transliterateToLatin('Київ'), 'kiyiv');
  same('Київ', 'Kyiv');
});

test('the stage examples all meet under one skeleton', () => {
  same('Tashkent', 'Toshkent');
  same('Chilanzar', 'Chilonzor');
  same('Алматы', 'Almaty');
});

test('cross-script spellings of the same place agree', () => {
  same('Ташкент', 'Toshkent');
  same('Чиланзар', 'Chilonzor');
  same('Самарканд', 'Samarqand');
  same('Бухара', 'Buxoro');
});

test('sound-equivalent Latin spellings agree', () => {
  same('Buxoro', 'Bukhoro');
  same('Xiva', 'Khiva');
  same('Navoi', 'Navoiy');
});

test('a skeleton keeps the first character so unrelated words stay apart', () => {
  assert.notEqual(geoSkeleton('Almaty'), geoSkeleton('Olmaty'), 'a different opening letter is a different word');
  assert.notEqual(geoSkeleton('Chilanzar'), geoSkeleton('Shilanzar'));
});

test('genuinely different places do not collide', () => {
  for (const [a, b] of [['Tashkent', 'Samarkand'], ['Chilonzor', 'Yunusobod'], ['Almaty', 'Astana'], ['Shifokorlar', 'Amir Temur']]) {
    assert.notEqual(geoSkeleton(a), geoSkeleton(b), `${a} and ${b} must not share a skeleton`);
  }
});

test('multi-word names keep their word structure', () => {
  assert.equal(geoSkeleton('Amir Temur').split(' ').length, 2);
  same('Amir Temur', 'Амир Темур');
});

test('numbers survive into the skeleton', () => {
  assert.ok(geoSkeleton('Chilonzor 7').includes('7'));
  assert.notEqual(geoSkeleton('Chilonzor 7'), geoSkeleton('Chilonzor 16'), 'a skeleton must not erase the number');
});

test('empty and punctuation-only input yield an empty skeleton', () => {
  assert.equal(geoSkeleton(''), '');
  assert.equal(geoSkeleton(null), '');
  assert.equal(geoSkeleton('---'), '');
});

test('an entity reports a skeleton for each distinct spelling', () => {
  const skeletons = geoSkeletonsOf({ normalizedAliases: ['toshkent', 'tashkent', 'ташкент'] });
  assert.equal(skeletons.length, 1, 'all three spellings collapse to one skeleton');
  assert.deepEqual(geoSkeletonsOf({ canonical: 'Samarqand' }), [geoSkeleton('Samarqand')]);
  assert.deepEqual(geoSkeletonsOf({}), []);
});

test('the skeleton index retrieves every spelling of an entity', () => {
  const index = buildSkeletonIndex([
    { entityId: 'tashkent', normalizedAliases: ['toshkent'] },
    { entityId: 'chilonzor', normalizedAliases: ['chilonzor'] },
    { entityId: 'samarkand', normalizedAliases: ['samarqand'] },
  ]);
  assert.deepEqual([...index.get(geoSkeleton('Tashkent'))], ['tashkent']);
  assert.deepEqual([...index.get(geoSkeleton('Чиланзар'))], ['chilonzor']);
  assert.equal(index.get(geoSkeleton('Nowhere')), undefined);
});

test('entities sharing a skeleton are both proposed, not silently merged', () => {
  const index = buildSkeletonIndex([
    { entityId: 'a', normalizedAliases: ['chilonzor'] },
    { entityId: 'b', normalizedAliases: ['chilanzar'] },
  ]);
  assert.deepEqual([...index.get(geoSkeleton('Chilonzor'))].sort(), ['a', 'b'], 'a skeleton hit proposes candidates; verification decides');
});
