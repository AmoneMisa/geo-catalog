import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

const streets = new Map([
  ['Hvardiitsiv-Shyronintsiv Street', ['ua:kharkiv:street:hvardiitsiv-shyronintsiv', 1324398]],
  ['Yuvileinyi Avenue', ['ua:kharkiv:street:yuvileinyi-avenue', 1544670]],
  ['Traktorobudivnykiv Avenue', ['ua:kharkiv:street:traktorobudivnykiv-avenue', 1386634]],
  ['Lva Landau Avenue', ['ua:kharkiv:street:lva-landau-avenue', 1570082]],
  ['Aerokosmichnyi Avenue', ['ua:kharkiv:street:aerokosmichnyi-avenue', 1703731]],
  ['Valentynivska Street', ['ua:kharkiv:street:valentynivska', 2045337]],
]);

test('Kharkiv expanded street canonicals resolve to their physical owners', () => {
  for (const [canonical, [id, osmRelation]] of streets) {
    const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'street', canonical });
    assert.equal(entity?.id, id);
    assert.equal(entity?.osm?.type, 'relation');
    assert.equal(entity?.osm?.id, osmRelation);
  }
});

test('Kharkiv Amosova keeps a broad representative street anchor', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'street', canonical: 'Amosova Street' });
  assert.equal(entity?.id, 'ua:kharkiv:street:amosova');
  assert.equal(entity?.source, 'manual');
  assert.deepEqual(entity?.center, { lat: 49.982357, lng: 36.348972 });
  assert.equal(entity?.accuracyM, 2800);
});

test('Aerokosmichnyi uses the current owner while retaining a broad route extent', () => {
  const entity = getGeoEntity('ua:kharkiv:street:aerokosmichnyi-avenue');
  assert.equal(entity?.wikidataId, 'Q4381105');
  assert.deepEqual(entity?.bbox, { south: 49.86832, west: 36.24512, north: 49.98449, east: 36.29995 });
});

test('Sobornosti Ukrainy uses current naming and verified route extent', () => {
  const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Kharkiv', type: 'street', canonical: 'Sobornosti Ukrainy Street' });
  assert.equal(entity?.id, 'ua:kharkiv:street:sobornosti-ukrainy');
  assert.equal(entity?.source, 'manual');
  assert.deepEqual(entity?.center, { lat: 50.03373904037319, lng: 36.3589230525349 });
  assert.deepEqual(entity?.bbox, {
    south: 50.031605747785,
    west: 36.34591904048198,
    north: 50.03674003079843,
    east: 36.36962288588404,
  });
});
