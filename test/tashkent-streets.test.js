import test from 'node:test';
import assert from 'node:assert/strict';
import { TASHKENT_STREET_ADDRESS_ENTITIES } from '../src/data/uz/tashkent/streets-addresses.js';

const EXPECTED = Object.freeze(new Map([
  ['Afrosiyob Street', 88477637],
  ['Amir Temur Avenue', 176132087],
  ['Beruniy Avenue', 183250534],
  ['Bunyodkor Avenue', 31742450],
  ['Buyuk Ipak Yoli Street', 22802833],
  ['Furqat Street', 32034567],
  ['Islam Karimov Street', 144153763],
  ['Mirzo Ulugbek Avenue', 166011552],
  ['Muqimiy Street', 104669886],
  ['Nukus Street', 185624519],
  ['Shota Rustaveli Street', 32058252],
  ['Taras Shevchenko Street', 32082122],
]));

test('major Tashkent lexicon streets have verified OSM representative anchors', () => {
  const byCanonical = new Map(
    TASHKENT_STREET_ADDRESS_ENTITIES
      .filter(({ type }) => type === 'street')
      .map((entity) => [entity.canonicalName, entity]),
  );

  for (const [canonicalName, osmWayId] of EXPECTED) {
    const entity = byCanonical.get(canonicalName);
    assert.ok(entity, canonicalName);
    assert.equal(entity.country, 'UZ', canonicalName);
    assert.equal(entity.parentId, 'uz:tashkent', canonicalName);
    assert.equal(entity.source, 'osm', canonicalName);
    assert.equal(entity.accuracy, 'street', canonicalName);
    assert.equal(entity.osm?.type, 'way', canonicalName);
    assert.equal(entity.osm?.id, osmWayId, canonicalName);
    assert.ok(Number.isFinite(entity.center?.lat), canonicalName);
    assert.ok(Number.isFinite(entity.center?.lng), canonicalName);
    assert.ok(entity.accuracyM >= 500, canonicalName);
  }
});

test('new Tashkent street ids and OSM anchors are unique', () => {
  const entities = TASHKENT_STREET_ADDRESS_ENTITIES.filter(({ canonicalName }) => EXPECTED.has(canonicalName));
  assert.equal(new Set(entities.map(({ id }) => id)).size, EXPECTED.size);
  assert.equal(new Set(entities.map(({ osm }) => `${osm.type}:${osm.id}`)).size, EXPECTED.size);
});
