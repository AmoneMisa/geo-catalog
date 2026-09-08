import test from 'node:test';
import assert from 'node:assert/strict';
import { geoPoiCategory } from '../src/poi-taxonomy.js';
import { validateGeoCatalog } from '../src/validate.js';

test('classifies extended POI subtypes without a second entity taxonomy', () => {
  assert.equal(geoPoiCategory('poi.kindergarten'), 'education');
  assert.equal(geoPoiCategory('poi.railway_halt'), 'transport');
  assert.equal(geoPoiCategory('poi.parking_structure'), 'parking');
});

test('accepts provenance concordances while protecting compatibility fields', () => {
  const entity = {
    id: 'uz:tashkent:poi:sample-college', type: 'poi.college', country: 'UZ', canonicalName: 'Sample College',
    parentId: 'uz:tashkent', center: { lat: 41.3, lng: 69.2 }, source: 'manual',
    osm: { type: 'way', id: 42 }, wikidataId: 'Q42',
    concordances: { osm: [{ type: 'way', id: 42 }, { type: 'node', id: 43 }], wikidata: 'Q42', geonames: '123' },
    sourceNames: { ru: ['Примерный колледж'], uzLatn: ['Namunaviy kollej'] },
  };
  assert.equal(validateGeoCatalog([{ id: 'uz:tashkent', type: 'city', country: 'UZ', canonicalName: 'Tashkent', center: { lat: 41.3, lng: 69.2 } }, entity]).valid, true);
});
