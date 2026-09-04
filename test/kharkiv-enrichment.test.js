import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const streets = [
  'ua:kharkiv:street:natalii-uzhvii',
  'ua:kharkiv:street:lesia-serdiuka',
  'ua:kharkiv:street:vladyslava-zubenka',
  'ua:kharkiv:street:vasylia-stusa',
  'ua:kharkiv:street:romashova',
  'ua:kharkiv:street:poznanska',
  'ua:kharkiv:street:buchmy',
  'ua:kharkiv:street:tarasa-redkina',
  'ua:kharkiv:street:haribaldi',
  'ua:kharkiv:street:drahomanova',
  'ua:kharkiv:street:neskorenykh',
  'ua:kharkiv:street:svitla',
  'ua:kharkiv:street:ruslana-plokhodka',
  'ua:kharkiv:street:yany-chervonoi',
];

const residential = [
  'ua:kharkiv:residential:oleksiivski-akvareli',
  'ua:kharkiv:residential:nauchnyi',
  'ua:kharkiv:residential:5th-avenue',
  'ua:kharkiv:residential:metalist',
  'ua:kharkiv:residential:videnskyi-dim',
];

const microdistricts = [
  'ua:kharkiv:microdistrict:337-microdistrict',
  'ua:kharkiv:microdistrict:339-microdistrict',
  'ua:kharkiv:microdistrict:524-mikroraion',
];

test('Kharkiv enrichment exposes current canonical streets with nonzero coordinates', () => {
  for (const id of streets) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.country, 'UA');
    assert.equal(entity.parentId, 'ua:kharkiv');
    assert.equal(entity.type, 'street');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});

test('Kharkiv enrichment exposes verified residential complexes', () => {
  for (const id of residential) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.country, 'UA');
    assert.equal(entity.parentId, 'ua:kharkiv');
    assert.equal(entity.type, 'residential_complex');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});

test('Kharkiv enrichment exposes verified numbered microdistricts', () => {
  for (const id of microdistricts) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.country, 'UA');
    assert.equal(entity.parentId, 'ua:kharkiv');
    assert.equal(entity.type, 'microdistrict');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});

test('Kharkiv historical street names stay aliases instead of duplicate geo owners', () => {
  assert.equal(getGeoEntity('ua:kharkiv:street:heroiv-pratsi'), null);
  assert.equal(getGeoEntity('ua:kharkiv:street:druzhby-narodiv'), null);
  assert.equal(getGeoEntity('ua:kharkiv:street:peshkova'), null);
  assert.equal(getGeoEntity('ua:kharkiv:street:rodnykova'), null);

  assert.ok(getGeoEntity('ua:kharkiv:street:neskorenykh'));
  assert.ok(getGeoEntity('ua:kharkiv:street:sobornosti-ukrainy'));
  assert.ok(getGeoEntity('ua:kharkiv:street:tarasa-redkina'));
  assert.ok(getGeoEntity('ua:kharkiv:street:yany-chervonoi'));
});
