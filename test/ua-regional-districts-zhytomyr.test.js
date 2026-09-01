import test from 'node:test';
import assert from 'node:assert/strict';
import { getGeoChildren, getGeoEntity, resolveLexiconGeoEntity } from '../src/index.js';

test('Zhytomyr exposes exactly its two current administrative districts', () => {
  const districts = getGeoChildren('ua:zhytomyr').filter((entity) => entity.type === 'district');
  assert.deepEqual(districts.map((entity) => entity.canonicalName).sort(), ['Bohunskyi', 'Korolovskyi']);

  for (const entity of districts) {
    assert.equal(entity.parentId, 'ua:zhytomyr');
    assert.equal(entity.accuracy, 'district');
    assert.ok(entity.center?.lat && entity.center?.lng);
  }
});

test('Zhytomyr district canonicals resolve through the lexicon bridge', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'district', canonical: 'Bohunskyi' })?.id,
    'ua:zhytomyr:district:bohunskyi',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'district', canonical: 'Korolovskyi' })?.id,
    'ua:zhytomyr:district:korolovskyi',
  );
});

test('verified Zhytomyr listing localities resolve to independent OSM owners', () => {
  const expected = new Map([
    ['Korbutivka', ['ua:zhytomyr:microdistrict:korbutivka', 8328164724]],
    ['Khmilnyky', ['ua:zhytomyr:microdistrict:khmilnyky', 8796142617]],
    ['Sokolova Hora', ['ua:zhytomyr:microdistrict:sokolova-hora', 8328164720]],
    ['Putiatynka', ['ua:zhytomyr:microdistrict:putiatynka', 8328164732]],
  ]);

  for (const [canonical, [id, nodeId]] of expected) {
    assert.equal(
      resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'microdistrict', canonical })?.id,
      id,
    );
    const entity = getGeoEntity(id);
    assert.equal(entity?.source, 'osm');
    assert.equal(entity?.accuracy, 'neighborhood');
    assert.deepEqual(entity?.osm, { type: 'node', id: nodeId });
  }
});

test('verified Zhytomyr landmarks resolve through generic POI canonicals', () => {
  const expected = new Map([
    ['Castle Hill', 'ua:zhytomyr:poi:castle-hill'],
    ['Cosmonautics Museum', 'ua:zhytomyr:poi:cosmonautics-museum'],
    ['Korolov Museum', 'ua:zhytomyr:poi:korolov-museum'],
    ['Chatsky Rock', 'ua:zhytomyr:poi:chatsky-rock'],
    ['Hydropark', 'ua:zhytomyr:poi:hydropark'],
    ['Soborna Square', 'ua:zhytomyr:poi:soborna-square'],
  ]);

  for (const [canonical, id] of expected) {
    const entity = resolveLexiconGeoEntity({ country: 'UA', city: 'Zhytomyr', type: 'poi', canonical });
    assert.equal(entity?.id, id, canonical);
    assert.equal(getGeoEntity(id)?.accuracy, 'poi', canonical);
  }
});
