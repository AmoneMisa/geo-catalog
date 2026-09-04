import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';

const EXPECTED = Object.freeze([
  ['samal-1', 'Самал-1', 43.235731, 76.953963],
  ['samal-2', 'Самал-2', 43.231291, 76.954808],
  ['samal-3', 'Самал-3', 43.226818, 76.955993],
  ['aksai-1', 'Аксай-1', 43.242305, 76.833239],
  ['aksai-3a', 'Аксай-3А', 43.235587, 76.826564],
  ['koktem-1', 'Коктем-1', 43.230089, 76.926385],
  ['koktem-2', 'Коктем-2', 43.229498, 76.918489],
  ['koktem-3', 'Коктем-3', 43.234161, 76.918111],
  ['zhetisu-1', 'Жетысу-1', 43.222876, 76.839392],
  ['zhetisu-3', 'Жетысу-3', 43.219302, 76.842105],
  ['orbita-2', 'Орбита-2', 43.196954, 76.884649],
  ['orbita-4', 'Орбита-4', 43.196481, 76.877795],
  ['mamyr-1', 'Мамыр-1', 43.211247, 76.845707],
]);

test('Almaty core microdistricts are registered with verified representative centers', () => {
  for (const [slug, canonicalName, lat, lng] of EXPECTED) {
    const entity = GEO_ENTITIES.find(({ id }) => id === `kz:almaty:microdistrict:${slug}`);

    assert.ok(entity, `missing ${slug}`);
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.country, 'KZ');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kz:almaty');
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, 'manual');
    assert.equal(entity.accuracy, 'neighborhood');
    assert.ok(entity.sourceUrl?.startsWith('https://yandex.kz/maps/'));
  }
});

test('Almaty core microdistrict identifiers and centers are unique', () => {
  const entities = EXPECTED.map(([slug]) => GEO_ENTITIES.find(({ id }) => id === `kz:almaty:microdistrict:${slug}`));
  const ids = entities.map(({ id }) => id);
  const centers = entities.map(({ center }) => `${center.lat},${center.lng}`);

  assert.equal(new Set(ids).size, entities.length);
  assert.equal(new Set(centers).size, entities.length);
});
