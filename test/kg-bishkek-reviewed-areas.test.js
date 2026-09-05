import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const districts = Object.freeze([
  ['kg:bishkek:district:pervomaisky', 'Pervomaisky', 15600026],
  ['kg:bishkek:district:leninsky', 'Leninsky', 15600027],
  ['kg:bishkek:district:oktyabrsky', 'Oktyabrsky', 15600028],
  ['kg:bishkek:district:sverdlovsky', 'Sverdlovsky', 15600029],
]);

const microdistricts = Object.freeze([
  ['kg:bishkek:microdistrict:4-i-mikroraion', '4-й микрорайон', 'https://2gis.kg/bishkek/geo/15763260120760336'],
  ['kg:bishkek:microdistrict:5-i-mikroraion', '5-й микрорайон', 'https://2gis.kg/bishkek/geo/15763260120760330'],
  ['kg:bishkek:microdistrict:9-i-mikroraion', '9-й микрорайон', 'https://2gis.kg/bishkek/geo/15763260120760334'],
]);

test('reviewed Bishkek district owners retain stable ids with exact OSM relations', () => {
  for (const [id, canonicalName, osmId] of districts) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'district');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.equal(entity.source, 'osm');
    assert.deepEqual(entity.osm, { type: 'relation', id: osmId });
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/relation/${osmId}`);
  }
});

test('reviewed Bishkek microdistricts 4, 5 and 9 retain exact 2GIS provenance', () => {
  for (const [id, canonicalName, sourceUrl] of microdistricts) {
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'microdistrict');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.canonicalName, canonicalName);
    assert.equal(entity.parentId, 'kg:bishkek:district:oktyabrsky');
    assert.equal(entity.source, 'manual');
    assert.equal(entity.sourceUrl, sourceUrl);
    assert.equal(entity.osm, undefined);
  }
});

test('misclassified Bishkek review candidates do not create false spatial owners', () => {
  for (const id of [
    'kg:bishkek:district:bishkek',
    'kg:bishkek:district:bishkek-2',
    'kg:bishkek:district:bishkek-i',
    'kg:bishkek:district:bishkek-manas',
    'kg:bishkek:district:azhybek-baatyr-kochosu',
    'kg:bishkek:district:erkinbek-matyev-kochosu',
    'kg:bishkek:local-area:catholic-church-st-michael',
    'kg:bishkek:local-area:kok-zhar',
    'kg:bishkek:microdistrict:bishkek',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }

  const kokZhar = getGeoEntity('kg:bishkek:microdistrict:kok-zhar');
  assert.ok(kokZhar);
  assert.equal(kokZhar.canonicalName, 'Кок-Жар');
});
