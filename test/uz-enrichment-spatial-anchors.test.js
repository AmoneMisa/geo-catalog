import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity } from '../src/index.js';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const expected = Object.freeze([
  ['Andijan', 'mahalla', "Ma'rifat", 20598677],
  ['Andijan', 'mahalla', 'Mustaqillikning 21 yilligi', 20582797],
  ['Andijan', 'mahalla', "Taxtako'prik", 20515956],
  ['Fergana', 'local_area', 'Qirguli', 2171217263],
  ['Fergana', 'local_area', 'Navoiy', 20577025],
  ['Fergana', 'local_area', 'Mustaqillik', 20582351],
  ['Namangan', 'mahalla', 'Porloq', 20587979],
  ['Namangan', 'local_area', 'Boburshox', 20578134],
  ['Qarshi', 'mahalla', 'Navo', 1027278316],
  ['Qarshi', 'mahalla', 'Gungon', 1027317833],
  ['Qarshi', 'local_area', 'Old City', 4792825352],
  ['Qarshi', 'local_area', 'Xonobod', 10588792432],
  ['Jizzakh', 'local_area', 'Zilol', 11725490815],
  ['Jizzakh', 'local_area', 'Navoiy', 316353350],
  ['Jizzakh', 'poi', 'Sangzor River', 1310350609],
  ['Kosonsoy', 'local_area', 'Center', 969223446],
  ['Navoiy', 'mahalla', 'Guliston', 1137853275],
  ['Xonobod', 'poi', 'Andijan Reservoir', 14663093],
  ['Kattakurgan', 'poi', 'Kattakurgan Reservoir', 12571708],
]);

const namanganStreets = Object.freeze([
  ['galaba', 'Galaba Street', 798437179],
  ['alisher-navoiy', 'Alisher Navoiy Street', 720208509],
  ['islom-karimov', 'Islom Karimov Street', 26978858],
  ['qoqimboyshox', 'Qoqimboyshox Street', 718816732],
  ['nodira', 'Nodira Street', 525607577],
]);

test('verified enrichment anchors resolve through the lexicon bridge', () => {
  for (const [city, type, canonical, osmId] of expected) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city, type, canonical });
    assert.ok(resolved, `${city}/${canonical}`);
    assert.equal(resolved.source, 'osm', `${city}/${canonical}`);
    assert.equal(resolved.osm?.id, osmId, `${city}/${canonical}`);
    assert.ok(Number.isFinite(resolved.center?.lat), `${city}/${canonical}`);
    assert.ok(Number.isFinite(resolved.center?.lng), `${city}/${canonical}`);
  }
});

test('road matches from Namangan area searches are preserved as streets', () => {
  for (const [slug, canonicalName, osmId] of namanganStreets) {
    const entity = getGeoEntity(`uz:namangan:street:${slug}`);
    assert.ok(entity, canonicalName);
    assert.equal(entity.type, 'street', canonicalName);
    assert.equal(entity.canonicalName, canonicalName, canonicalName);
    assert.equal(entity.parentId, 'uz:namangan', canonicalName);
    assert.equal(entity.accuracy, 'street', canonicalName);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, canonicalName);
  }
});
