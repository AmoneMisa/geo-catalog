import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['goncharovskiy-boulevard', 'Гончаровский бульвар', 49.9830719, 36.215713, 1000223112],
  ['zhasminovyy-boulevard', 'Жасминовый бульвар', 49.9494549, 36.3199808, 237026869],
  ['profsoyuznyy-boulevard', 'Профсоюзный бульвар', 49.9715998, 36.1867653, 34772365],
  ['frontovikov-boulevard', 'бульвар Фронтовиков', 50.0478162, 36.1944598, 724277024],
  ['sadovyy-boulevard', 'Садовый бульвар', 50.0560612, 36.298043, 34838627],
  ['yureva-boulevard', 'бульвар Юрьева', 49.9611981, 36.3246346, 844367679],
  ['bogdana-khmelnitskogo-boulevard', 'бульвар Богдана Хмельницкого', 49.9566631, 36.3500919, 732334809],
  ['dmitriya-antonovicha-boulevard', 'бульвар Дмитрия Антоновича', 49.9290018, 36.4371501, 80946348],
]);

test('reviewed Kharkiv boulevards retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:kharkiv:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:kharkiv', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});
