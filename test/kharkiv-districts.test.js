import test from 'node:test';
import assert from 'node:assert/strict';
import { findGeoEntities, getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Kharkiv districts retain verified OSM relation identities', () => {
  const expected = new Map([
    ['ua:kharkiv:district:industrialnyi', 7340969],
    ['ua:kharkiv:district:kyivskyi', 7340973],
    ['ua:kharkiv:district:nemyshlianskyi', 7340972],
    ['ua:kharkiv:district:novobavarskyi', 3801278],
    ['ua:kharkiv:district:osnovianskyi', 3801315],
    ['ua:kharkiv:district:saltivskyi', 7340971],
    ['ua:kharkiv:district:slobidskyi', 7340970],
    ['ua:kharkiv:district:kholodnohirskyi', 3801249],
    ['ua:kharkiv:district:shevchenkivskyi', 3796255],
  ]);

  const districts = findGeoEntities({ country: 'UA', parentId: 'ua:kharkiv', type: 'district' });
  assert.equal(districts.length, 9);
  assert.ok(districts.every((district) => district.source === 'osm' && district.boundary));
  for (const [id, relationId] of expected) {
    assert.deepEqual(getGeoEntity(id)?.osm, { type: 'relation', id: relationId }, id);
  }
});

test('Kyiv districts expose validated OSM relation boundaries', () => {
  const districts = findGeoEntities({ country: 'UA', parentId: 'ua:kyiv', type: 'district' });
  assert.equal(districts.length, 10);
  assert.ok(districts.every((district) => (
    district.source === 'osm'
    && district.osm?.type === 'relation'
    && (district.boundary?.type === 'Polygon' || district.boundary?.type === 'MultiPolygon')
  )));
});

test('major Ukrainian city districts expose validated OSM boundaries', () => {
  const expectedCounts = new Map([
    ['ua:kyiv', 10], ['ua:kharkiv', 9], ['ua:odesa', 4], ['ua:dnipro', 8],
    ['ua:lviv', 6], ['ua:zaporizhzhia', 7], ['ua:kryvyi-rih', 7],
  ]);

  for (const [parentId, expectedCount] of expectedCounts) {
    const districts = findGeoEntities({ country: 'UA', parentId, type: 'district' });
    assert.equal(districts.length, expectedCount, parentId);
    assert.ok(districts.every((district) => district.source === 'osm' && district.boundary), parentId);
  }
});

test('major Ukrainian district canonicals resolve through the lexicon bridge', () => {
  const expected = new Map([
    ['Kyiv', ['Holosiivskyi', 'Darnytskyi', 'Desnianskyi', 'Dniprovskyi', 'Obolonskyi', 'Pecherskyi', 'Podilskyi', 'Sviatoshynskyi', 'Solomianskyi', 'Shevchenkivskyi']],
    ['Kharkiv', ['Shevchenkivskyi', 'Saltivskyi', 'Kholodnohirskyi', 'Nemyshlianskyi', 'Kyivskyi', 'Novobavarskyi', 'Industrialnyi', 'Osnovianskyi', 'Slobidskyi']],
    ['Odesa', ['Prymorskyi', 'Kyivskyi', 'Khadzhybeiskyi', 'Peresypskyi']],
    ['Dnipro', ['Amur-Nyzhnodniprovskyi', 'Industrialnyi', 'Samarskyi', 'Novokodatskyi', 'Tsentralnyi', 'Chechelivskyi', 'Sobornyi', 'Shevchenkivskyi']],
    ['Lviv', ['Halytskyi', 'Zaliznychnyi', 'Lychakivskyi', 'Sykhivskyi', 'Frankivskyi', 'Shevchenkivskyi']],
    ['Zaporizhzhia', ['Voznesenivskyi', 'Dniprovskyi', 'Zavodskyi', 'Kosmichnyi', 'Oleksandrivskyi', 'Khortytskyi', 'Shevchenkivskyi']],
    ['Kryvyi Rih', ['Ternivskyi', 'Pokrovskyi', 'Saksahanskyi', 'Tsentralno-Miskyi', 'Dovhyntsivskyi', 'Metalurhiinyi', 'Inhuletskyi']],
  ]);

  for (const [city, canonicals] of expected) {
    for (const canonical of canonicals) {
      assert.ok(resolveLexiconGeoEntity({ country: 'UA', city, type: 'district', canonical }), `${city}/${canonical}`);
    }
  }
});
