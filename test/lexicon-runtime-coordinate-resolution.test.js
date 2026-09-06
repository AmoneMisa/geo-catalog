import test from 'node:test';
import assert from 'node:assert/strict';

import {
  geoIdForLexiconEntity,
  hasLexiconGeoEntity,
  resolveLexiconGeoEntity,
} from '../src/index.js';

const runtimeCases = Object.freeze([
  {
    input: {
      country: 'UZ',
      city: 'Tashkent',
      type: 'streets',
      name: 'Shifokorlar Street',
    },
    id: 'uz:tashkent:street:shifokorlar',
    type: 'street',
  },
  {
    input: {
      country: 'UZ',
      city: 'Tashkent',
      type: 'residentialComplexes',
      name: 'ЖК "Ness City"',
    },
    id: 'uz:tashkent:residential_complex:ness-city',
    type: 'residential_complex',
  },
  {
    input: {
      country: 'UZ',
      city: 'Tashkent',
      type: 'microdistricts',
      name: 'Chilanzar-21',
    },
    id: 'uz:tashkent:microdistrict:chilanzar-21',
    type: 'microdistrict',
  },
]);

test('parsing-lexicon runtime matches resolve directly to map-ready geo coordinates', () => {
  for (const { input, id, type } of runtimeCases) {
    const entity = resolveLexiconGeoEntity(input);

    assert.ok(entity, input.name);
    assert.equal(entity.id, id, input.name);
    assert.equal(entity.type, type, input.name);
    assert.equal(Number.isFinite(entity.center?.lat), true, `${input.name} latitude`);
    assert.equal(Number.isFinite(entity.center?.lng), true, `${input.name} longitude`);
    assert.notEqual(entity.center.lat, 0, `${input.name} latitude must not be synthetic zero`);
    assert.notEqual(entity.center.lng, 0, `${input.name} longitude must not be synthetic zero`);
    assert.equal(geoIdForLexiconEntity(input), id, input.name);
    assert.equal(hasLexiconGeoEntity(input), true, input.name);
  }
});

test('canonical singular geo inputs remain backwards compatible', () => {
  const entity = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Tashkent',
    type: 'street',
    canonical: 'Shifokorlar Street',
  });

  assert.equal(entity?.id, 'uz:tashkent:street:shifokorlar');
});

test('unresolved runtime matches stay null instead of fabricating coordinates', () => {
  const input = {
    country: 'UZ',
    city: 'Tashkent',
    type: 'streets',
    name: 'Definitely Missing Street',
  };

  assert.equal(resolveLexiconGeoEntity(input), null);
  assert.equal(geoIdForLexiconEntity(input), null);
  assert.equal(hasLexiconGeoEntity(input), false);
});
