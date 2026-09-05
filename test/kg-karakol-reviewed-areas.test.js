import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = Object.freeze([
  ['kg:karakol:microdistrict:kashka-suu', 'microdistrict', 'Кашка-Суу', 'https://2gis.kg/karakol/geo/70030076874779634'],
  ['kg:karakol:microdistrict:khan-tengri', 'microdistrict', 'Хан-Теңири', 'https://2gis.kg/karakol/geo/70030077147206702'],
  ['kg:karakol:residential:karakol-residence', 'residential_complex', 'Karakol Residence', 'https://2gis.kg/karakol/firm/70000001076253420'],
]);

test('reviewed Karakol areas expose one canonical entity per verified identity', () => {
  for (const [id, type, canonicalName, sourceUrl] of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.country, 'KG');
    assert.equal(entity.type, type);
    assert.equal(entity.parentId, 'kg:karakol');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.osm, undefined);
  }
});

test('review noise is not promoted as separate Karakol identities', () => {
  assert.equal(getGeoEntity('kg:karakol:microdistrict:stroyka-gik-mkr-khan-tengiri'), null);
  assert.equal(getGeoEntity('kg:karakol:district:karakol'), null);
});
