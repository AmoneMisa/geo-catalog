import assert from 'node:assert/strict';
import test from 'node:test';
import { UA_MAP_DATA_ENTITIES } from '../data-source/ua/map-data.js';
import { KZ_MAP_DATA_ENTITIES } from '../data-source/kz/map-data.js';
import { RO_MAP_DATA_ENTITIES } from '../data-source/ro/map-data.js';

const GENERATED = [UA_MAP_DATA_ENTITIES, KZ_MAP_DATA_ENTITIES, RO_MAP_DATA_ENTITIES].flat();

test('a street is not aliased by the place it was named after', () => {
  const lane = UA_MAP_DATA_ENTITIES.find((entity) => entity.osm?.id === 31767140);
  assert.equal(lane?.canonicalName, 'Подільський провулок');
  assert.ok(!lane.sourceNames.canonical.includes('Поділ'));
  const tatarska = UA_MAP_DATA_ENTITIES.find((entity) => entity.osm?.id === 51048974);
  assert.ok(!tatarska.sourceNames.canonical.some((name) => /Татарка/u.test(name) && name !== tatarska.canonicalName));
});

test('generated map-data aliases never carry Wikidata ids or wikipedia-style references', () => {
  const polluted = GENERATED.filter((entity) => (entity.sourceNames?.canonical || [])
    .some((name) => /^Q\d+$/.test(name) || /^[a-z]{2,3}:\S/u.test(name)));
  assert.deepEqual(polluted.map((entity) => entity.id).slice(0, 5), []);
});
