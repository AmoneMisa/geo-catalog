import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['2 quarter', 41.00674, 70.08757, 12511090503],
  ['3 quarter', 41.00522, 70.08401, 3341366556],
  ['5 quarter', 41.00745, 70.07844, 12511090507],
  ['6 quarter', 41.00916, 70.08169, 12511090506],
  ['7 quarter', 41.00717, 70.08254, 12511090509],
  ['8 quarter', 41.00871, 70.08597, 12511090504],
  ['9 quarter', 41.01054, 70.08465, 12511090505],
  ['10 quarter', 41.01198, 70.08805, 12511090510],
  ['11 quarter', 41.01010, 70.08950, 12511090511],
  ['2/2 quarter', 41.02050, 70.09218, 3132947339],
  ['2/5 quarter', 41.01392, 70.10429, 12511090516],
  ['3/2 quarter', 41.02624, 70.08093, 12512983418],
  ['3/3 quarter', 41.02690, 70.08693, 11842421523],
  ['4/5 quarter', 41.01325, 70.08212, 12511090520],
  ['4/6 quarter', 41.01153, 70.07833, 3341366553],
  ['5/1A quarter', 41.00460, 70.07288, 12511090502],
  ['5/1B quarter', 41.00174, 70.07451, 6480652021],
  ['5/3 quarter', 40.99609, 70.05461, 3341366554],
  ['5/4 quarter', 40.99928, 70.05760, 3341366555],
  ['5/5 quarter', 41.00305, 70.05573, 12510995291],
  ['6/4 quarter', 41.00910, 70.06467, 12511090501],
  ['18/19 quarter', 41.01170, 70.09967, 12511090515],
  ['32 quarter', 41.01727, 70.08485, 12511090513],
]);

test('Angren verified quarters have exact OSM neighbourhood anchors', () => {
  for (const [canonical, lat, lng, osmId] of expected) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UZ',
      city: 'Angren',
      type: 'microdistrict',
      canonical,
    });

    assert.ok(resolved, canonical);
    assert.equal(resolved.canonicalName, canonical);
    assert.equal(resolved.parentId, 'uz:angren');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'osm');
    assert.equal(resolved.accuracy, 'neighborhood');
    assert.deepEqual(resolved.osm, { type: 'node', id: osmId });
  }
});

test('Angren quarter anchors are unique catalogue entities', () => {
  const ids = expected.map(([canonical]) => {
    const matches = GEO_ENTITIES.filter((entity) => entity.parentId === 'uz:angren' && entity.canonicalName === canonical);
    assert.equal(matches.length, 1, canonical);
    return matches[0].id;
  });

  assert.equal(new Set(ids).size, ids.length);
});
