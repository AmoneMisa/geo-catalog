import test from 'node:test';
import assert from 'node:assert/strict';

import { TASHKENT_POI_ENTITIES } from '../data-source/uz/tashkent/poi.js';

const byName = new Map(TASHKENT_POI_ENTITIES.map((entry) => [entry.canonicalName, entry]));

test('medical-tourism anchors keep the supplied Tashkent coordinates', () => {
  const expected = new Map([
    ['AKFA Medline', [41.3428743, 69.2088482]],
    ['Shifo Nur', [41.3640086, 69.2751261]],
    ['Nano Medical Clinic', [41.3480919, 69.2149290]],
    ['Medas Medical Center', [41.3539572, 69.2871740]],
    ['Prof Med Clinic', [41.3539309, 69.2876548]],
    ['Dr. Akshay Kumar Eye Clinic', [41.3216087, 69.2156061]],
    ['Shox International Hospital', [41.2693158, 69.2631867]],
  ]);

  for (const [name, [lat, lng]] of expected) {
    const entity = byName.get(name);
    assert.ok(entity, name);
    assert.equal(entity.center.lat, lat, name);
    assert.equal(entity.center.lng, lng, name);
    assert.notEqual(entity.center.lat, 0, name);
    assert.notEqual(entity.center.lng, 0, name);
  }
});

test('hospital-class medical anchors retain hospital POI typing', () => {
  assert.equal(byName.get('AKFA Medline')?.type, 'poi.hospital');
  assert.equal(byName.get('Shox International Hospital')?.type, 'poi.hospital');
});
