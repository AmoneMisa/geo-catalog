import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoEntity, resolveLexiconGeoEntity, isGeoCoverageGap } from '../src/index.js';
import { isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';

const exactMahallas = Object.freeze([
  ['Andijan', "Bo'ston", 'uz:andijan:mahalla:boston', 'relation', 20573268],
  ['Andijan', 'Temur Malik', 'uz:andijan:mahalla:temur-malik', 'relation', 20513201],
  ['Andijan', "Qoraqo'rg'on", 'uz:andijan:mahalla:qoraqorgon', 'relation', 20513483],
  ['Andijan', 'Birlashgan', 'uz:andijan:mahalla:birlashgan', 'relation', 20515944],
  ['Fergana', "Ma'rifat", 'uz:fergana:mahalla:marifat', 'relation', 20577024],
  ['Nukus', 'Nurli bostan', 'uz:nukus:mahalla:nurli-bostan', 'way', 1009066254],
  ['Nukus', 'Jeke terek', 'uz:nukus:mahalla:jeke-terek', 'way', 1009066249],
  ['Nukus', 'Uzin kol', 'uz:nukus:mahalla:uzin-kol', 'way', 1009066252],
  ['Nukus', 'Amanliq guzari', 'uz:nukus:mahalla:amanliq-guzari', 'way', 1009066239],
  ['Nukus', 'Shimbay guzari', 'uz:nukus:mahalla:shimbay-guzari', 'way', 1009066193],
  ['Nukus', 'Dosliq guzari', 'uz:nukus:mahalla:dosliq-guzari', 'way', 1009066211],
  ['Nukus', 'Dosliq', 'uz:nukus:mahalla:dosliq', 'way', 1009066191],
  ['Nukus', 'Jiydeli baysin', 'uz:nukus:mahalla:jiydeli-baysin', 'way', 1009066206],
  ['Urgench', 'Mustaqillik', 'uz:urgench:mahalla:mustaqillik', 'way', 993738430],
  ['Urgench', 'Feruz', 'uz:urgench:mahalla:feruz', 'node', 10241914213],
  ['Urgench', "Yuqori bog'", 'uz:urgench:mahalla:yuqori-bog', 'way', 993738428],
  ['Urgench', 'Besh mergan', 'uz:urgench:mahalla:besh-mergan', 'way', 993685088],
  ['Urgench', 'Shodlik', 'uz:urgench:mahalla:shodlik', 'node', 10249009095],
  ['Urgench', 'Gulshan', 'uz:urgench:mahalla:gulshan', 'node', 10250827178],
  ['Urgench', 'Gulzor', 'uz:urgench:mahalla:gulzor', 'way', 993685099],
  ['Urgench', 'Navbahor', 'uz:urgench:mahalla:navbahor', 'node', 10258961941],
  ['Urgench', 'Avesto', 'uz:urgench:mahalla:avesto', 'node', 10259664666],
]);

test('verified UZ mahallas resolve to their persisted OSM owners', () => {
  for (const [city, canonical, id, osmType, osmId] of exactMahallas) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city, type: 'mahalla', canonical });
    assert.ok(resolved, `${city}: ${canonical}`);
    assert.equal(resolved.id, id);
    assert.equal(resolved.type, 'mahalla');
    assert.equal(resolved.source, 'osm');
    assert.deepEqual(resolved.osm, { type: osmType, id: osmId });
    assert.equal(isGeoCoverageGap({ country: 'UZ', city, type: 'mahalla', canonical }), false);
  }
});

const semanticAreaFallbacks = Object.freeze([
  ['Andijan', 'Bobur', 'uz:andijan:mahalla:bobur'],
  ['Fergana', 'Mustaqillik', 'uz:fergana:mahalla:mustaqillik'],
  ['Fergana', 'Navoiy', 'uz:fergana:mahalla:navoiy'],
  ['Jizzakh', 'Navoiy', 'uz:jizzakh:mahalla:navoiy'],
  ['Qarshi', 'Geolog', 'uz:qarshi:mahalla:geolog'],
  ['Nukus', 'Dosliq', 'uz:nukus:mahalla:dosliq'],
  ['Urgench', 'Olimpiya', 'uz:urgench:mahalla:olimpiya'],
]);

test('listing-area canonicals reuse verified mahalla owners without duplicating physical entities', () => {
  for (const [city, canonical, id] of semanticAreaFallbacks) {
    const resolved = resolveLexiconGeoEntity({ country: 'UZ', city, type: 'local_area', canonical });
    assert.ok(resolved, `${city}: ${canonical}`);
    assert.equal(resolved.id, id);
    assert.equal(resolved.type, 'mahalla');
    assert.equal(getGeoEntity(id)?.id, id);
  }
});

test('Old Termez has a verified archaeological owner while its broader listing area remains conservative', () => {
  const poi = getGeoEntity('uz:termez:poi:old-termez');
  assert.ok(poi);
  assert.equal(poi.type, 'poi.archaeological_site');
  assert.equal(poi.source, 'osm');
  assert.deepEqual(poi.osm, { type: 'way', id: 499907480 });
  assert.deepEqual(poi.center, { lat: 37.2642736, lng: 67.192273 });

  const resolvedPoi = resolveLexiconGeoEntity({ country: 'UZ', city: 'Termez', type: 'poi', canonical: 'Old Termez' });
  assert.equal(resolvedPoi?.id, poi.id);
  assert.equal(isUzSecondaryCoverageGap({ country: 'UZ', city: 'Termez', type: 'poi', canonical: 'Old Termez' }), false);

  const resolvedArea = resolveLexiconGeoEntity({ country: 'UZ', city: 'Termez', type: 'local_area', canonical: 'Old Termez' });
  assert.equal(resolvedArea?.id, poi.id);
  assert.equal(isUzSecondaryCoverageGap({ country: 'UZ', city: 'Termez', type: 'local_area', canonical: 'Old Termez' }), true);
});
