import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO_ENTITIES } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';
import { isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const expected = Object.freeze([
  ['Yangiyer', 'uz:yangiyer:poi:yangiyer-railway-station', 40.29627, 68.82489, 8343455277, 'tail'],
  ['Margilan', 'uz:margilan:poi:margilan-railway-station', 40.44258, 71.72309, 246213673, 'secondary'],
  ['Kokand', 'uz:kokand:poi:kokand-1-railway-station', 40.51901, 70.92847, 1587385859, 'secondary'],
  ['Kungrad', 'uz:kungrad:poi:kungrad-railway-station', 43.04077, 58.84135, 1583746274, 'tail'],
  ['Turtkul', 'uz:turtkul:poi:turtkul-railway-station', 41.57057, 61.03238, 1592362133, 'tail'],
]);

test('verified station batch uses exact OSM station nodes', () => {
  for (const [city, id, lat, lng, osmId] of expected) {
    const entity = GEO_ENTITIES.find((candidate) => candidate.id === id);
    assert.ok(entity, city);
    assert.equal(entity.canonicalName, `${city} Railway Station`);
    assert.deepEqual(entity.center, { lat, lng });
    assert.equal(entity.source, 'osm');
    assert.equal(entity.accuracy, 'poi');
    assert.deepEqual(entity.osm, { type: 'node', id: osmId });
  }
});

test('verified station batch closes Railway Station area gaps conservatively', () => {
  for (const [city, _id, lat, lng, _osmId, gapSet] of expected) {
    const resolved = resolveLexiconGeoEntity({
      country: 'UZ',
      city,
      type: 'local_area',
      canonical: 'Railway Station area',
    });

    assert.ok(resolved, city);
    assert.equal(resolved.type, 'local_area');
    assert.deepEqual(resolved.center, { lat, lng });
    assert.equal(resolved.source, 'manual');
    assert.equal(resolved.accuracy, 'approximate');
    assert.equal(resolved.accuracyM, 1100);

    const isGap = gapSet === 'secondary' ? isUzSecondaryCoverageGap : isUzTailCoverageGap;
    assert.equal(isGap({
      country: 'UZ',
      city,
      type: 'local_area',
      canonical: 'Railway Station area',
    }), false, city);
  }
});
