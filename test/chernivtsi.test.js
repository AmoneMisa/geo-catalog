import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGeoChildren,
  resolveLexiconGeoEntity,
} from '../src/index.js';

test('Chernivtsi lexicon microdistrict canonicals resolve to spatial entities', () => {
  const microdistricts = getGeoChildren('ua:chernivtsi').filter((entity) => entity.type === 'microdistrict');
  assert.equal(microdistricts.length, 22);

  const expected = new Map([
    ['Kalichanka', 'ua:chernivtsi:microdistrict:kalichanka'],
    ['Sadgora', 'ua:chernivtsi:microdistrict:sadhora'],
    ['Roscha', 'ua:chernivtsi:microdistrict:rosha'],
    ['Pivdenno-Kiltseva', 'ua:chernivtsi:microdistrict:pivdenno-kiltseva'],
  ]);

  for (const [canonical, id] of expected) {
    assert.equal(resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'microdistrict', canonical })?.id, id);
  }
});

test('Chernivtsi expanded neighborhoods keep verified spatial owners', () => {
  const entities = new Map(getGeoChildren('ua:chernivtsi').map((entity) => [entity.id, entity]));
  const expected = new Map([
    ['ua:chernivtsi:microdistrict:rohizna', 2377048989],
    ['ua:chernivtsi:microdistrict:stara-zhuchka', 2377048992],
    ['ua:chernivtsi:microdistrict:nova-zhuchka', 2377048988],
    ['ua:chernivtsi:microdistrict:sadky', 8626772576],
    ['ua:chernivtsi:microdistrict:pentagon', 10650263108],
    ['ua:chernivtsi:microdistrict:mashzavod', 9397109160],
    ['ua:chernivtsi:microdistrict:pivdennyi-masyv', 10650276646],
    ['ua:chernivtsi:microdistrict:horecha', 2377048983],
    ['ua:chernivtsi:microdistrict:stare-misto', 10815462328],
  ]);

  for (const [id, osmId] of expected) {
    const entity = entities.get(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.source, 'osm');
    assert.equal(entity.osm?.id, osmId);
  }
});

test('Chernivtsi residential and landmark canonicals resolve deterministically', () => {
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'residential_complex', canonical: 'Comfort Hall' })?.id,
    'ua:chernivtsi:residential:comfort-hall',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'poi', canonical: 'Chernivtsi University' })?.id,
    'ua:chernivtsi:poi:chernivtsi-university',
  );
  assert.equal(
    resolveLexiconGeoEntity({ country: 'UA', city: 'Chernivtsi', type: 'poi', canonical: 'City Hall' })?.id,
    'ua:chernivtsi:poi:city-hall',
  );
});

test('Chernivtsi expanded POIs include transport, market, park and shopping anchors', () => {
  const pois = getGeoChildren('ua:chernivtsi').filter((entity) => entity.type.startsWith('poi.'));
  assert.equal(pois.length, 21);
  const entities = new Map(pois.map((entity) => [entity.id, entity]));

  assert.deepEqual(entities.get('ua:chernivtsi:poi:chernivtsi-railway-station')?.center, { lat: 48.30105, lng: 25.92998 });
  assert.equal(entities.get('ua:chernivtsi:poi:chernivtsi-railway-station')?.osm?.id, 255367661);
  assert.equal(entities.get('ua:chernivtsi:poi:chernivtsi-international-airport')?.wikidataId, 'Q1708535');
  assert.equal(entities.get('ua:chernivtsi:poi:kalynivskyi-market')?.source, 'official');
  assert.deepEqual(entities.get('ua:chernivtsi:poi:zhovtnevyi-park')?.center, { lat: 48.258349, lng: 25.940491 });
  assert.equal(entities.get('ua:chernivtsi:poi:kobylianska-drama-theatre')?.osm?.id, 23540006);
  assert.equal(entities.get('ua:chernivtsi:poi:bukovyna-mall')?.osm?.id, 105837965);
  assert.equal(entities.get('ua:chernivtsi:poi:formarket-shopping-center')?.osm?.id, 32872856);
  assert.equal(entities.get('ua:chernivtsi:poi:maidan-shopping-center')?.osm?.id, 23565362);
});
