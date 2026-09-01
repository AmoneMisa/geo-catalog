import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/index.js';
import { isGeoCoverageGap } from '../src/coverage-gaps.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const verifiedLocalAreas = [
  ['Beshyogoch', 'uz:tashkent:local-area:beshyogoch', 'way', 1387704165],
  ["Bog'bon", 'uz:tashkent:local-area:bogbon', 'way', 557224880],
  ['Chuqursoy', 'uz:tashkent:local-area:chuqursoy', 'way', 1387765069],
  ['C-7', 'uz:tashkent:local-area:c-7', 'way', 1387797817],
  ['Dehqonobod', 'uz:tashkent:local-area:dehqonobod', 'node', 12720744632],
  ['Gulobod', 'uz:tashkent:local-area:gulobod', 'way', 1387727064],
  ['Ibn Sino-1', 'uz:tashkent:local-area:ibn-sino-1', 'way', 103249732],
  ['Kuylyuk Center', 'uz:tashkent:local-area:kuylyuk-center', 'way', 1387732900],
  ['Lolazor', 'uz:tashkent:local-area:lolazor', 'way', 1387723899],
  ['Manzara', 'uz:tashkent:local-area:manzara', 'way', 1387719997],
  ['Muxbir', 'uz:tashkent:local-area:muxbir', null, null],
  ['Minora', 'uz:tashkent:local-area:minora', null, null],
  ['Oltinkul', 'uz:tashkent:local-area:oltinkul', 'way', 1387737565],
  ['Qorasuv-1', 'uz:tashkent:local-area:qorasuv-1', 'way', 1387689816],
  ['Rakatboshi', 'uz:tashkent:local-area:rakatboshi', 'way', 1387725609],
  ['Sebzor', 'uz:tashkent:local-area:sebzor', 'way', 1387743571],
  ['Shohimardon', 'uz:tashkent:local-area:shohimardon', 'way', 1387710687],
  ['Shifokorlar-1', 'uz:tashkent:local-area:shifokorlar-1', null, null],
  ['Shifokorlar-2', 'uz:tashkent:local-area:shifokorlar-2', null, null],
  ['Shifokorlar-3', 'uz:tashkent:local-area:shifokorlar-3', null, null],
  ['Shifokorlar-4', 'uz:tashkent:local-area:shifokorlar-4', null, null],
  ['Shimoliy Olmazor-2', 'uz:tashkent:local-area:shimoliy-olmazor-2', null, null],
  ['So\'lim', 'uz:tashkent:local-area:solim', null, null],
  ['Sug\'diyona', 'uz:tashkent:local-area:sugdiyona', null, null],
  ['Suvsoz-1', 'uz:tashkent:local-area:suvsoz-1', 'way', 1387706854],
  ['Suvsoz-2', 'uz:tashkent:local-area:suvsoz-2', 'way', 1387707212],
  ['Suvsoz-3', 'uz:tashkent:local-area:suvsoz-3', null, null],
  ['Suvsoz-4', 'uz:tashkent:local-area:suvsoz-4', null, null],
  ['Suvsoz-5', 'uz:tashkent:local-area:suvsoz-5', null, null],
  ['Taraqqiyot-1', 'uz:tashkent:local-area:taraqqiyot-1', 'way', 1387689531],
  ['Taraqqiyot-2', 'uz:tashkent:local-area:taraqqiyot-2', 'way', 1387689468],
  ['Taraqqiyot-3', 'uz:tashkent:local-area:taraqqiyot-3', 'way', 1387689470],
];

test('verified Tashkent local areas resolve to their exact OSM owners', () => {
  for (const [canonical, id, osmType, osmId] of verifiedLocalAreas) {
    const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical });
    assert.equal(entity?.id, id, canonical);
    assert.equal(isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical }), false, canonical);
    if (osmType) assert.deepEqual(entity?.osm, { type: osmType, id: osmId }, canonical);
  }
});

test('verified approximate Tashkent local-area centers remain explicitly non-OSM', () => {
  for (const canonical of ['Muxbir', 'Minora', 'Shifokorlar-1', 'Shifokorlar-2', 'Shifokorlar-3', 'Shifokorlar-4', 'Shimoliy Olmazor-2', "So'lim", "Sug'diyona", 'Suvsoz-3', 'Suvsoz-4', 'Suvsoz-5']) {
    const entity = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical });
    assert.equal(entity?.source, 'manual', canonical);
    assert.equal(entity?.osm, undefined, canonical);
  }
});

test('Manzara local area does not consume the unresolved microdistrict identity', () => {
  const localArea = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Manzara' });
  assert.equal(localArea?.id, 'uz:tashkent:local-area:manzara');
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'microdistrict', canonical: 'Manzara' }),
    true,
  );
  assert.equal(
    isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: 'Manzara' }),
    false,
  );
});

test('same-name Tashkent mahallas remain independent spatial identities', () => {
  for (const canonical of ["Bog'bon", "Chamanbog'"]) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical }),
      true,
      canonical,
    );
  }

  for (const canonical of ['Humoyun', 'Asalobod', 'Gulobod', 'Qalqon', 'Olimpiya', 'Sebzor']) {
    assert.equal(
      isGeoCoverageGap({ country: 'UZ', city: 'Tashkent', type: 'mahalla', canonical }),
      false,
      canonical,
    );
  }

  const ibnSinoMahalla = getGeoEntity('uz:tashkent:mahalla:ibn-sino');
  const ibnSino1 = getGeoEntity('uz:tashkent:local-area:ibn-sino-1');
  assert.deepEqual(ibnSinoMahalla?.osm, { type: 'way', id: 149991108 });
  assert.deepEqual(ibnSino1?.osm, { type: 'way', id: 103249732 });
  assert.notEqual(ibnSinoMahalla?.id, ibnSino1?.id);
});
