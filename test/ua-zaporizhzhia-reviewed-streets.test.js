import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['bilohirska', 'вулиця Білогірська', 47.8008175, 35.2310684, 132204410],
  ['myrna', 'вулиця Мирна', 47.8041884, 35.2304088, 131988367],
  ['molochna', 'вулиця Молочна', 47.8103836, 35.241466, 28655212],
  ['pochaivska', 'вулиця Почаївська', 47.8279246, 35.2249589, 130097709],
  ['radialna', 'вулиця Радіальна', 47.8707316, 35.2183072, 133359715],
  ['radisna', 'вулиця Радісна', 47.8063327, 35.2316506, 131988335],
  ['sadivnytstva', 'вулиця Садівництва', 47.815893, 35.236091, 50847410],
  ['slobozhanska', 'вулиця Слобожанська', 47.8041221, 35.2364946, 132204416],
  ['tesliarska', 'вулиця Теслярська', 47.8128699, 35.2310016, 131944475],
  ['fontanna', 'вулиця Фонтанна', 47.8133059, 35.2329154, 131991132],
  ['inzhenera-preobrazhenskoho', 'проспект Інженера Преображенського', 47.817492, 35.0608967, 34929457],
  ['heroiv-natsionalnoi-hvardii-ukrainy', 'проспект Героїв Національної Гвардії України', 47.7750168, 35.1753913, 488356350],
  ['metalurhiv', 'проспект Металургів', 47.8591992, 35.105796, 379542595],
  ['sobornyi', 'проспект Соборний', 47.8147387, 35.1789787, 1442596890],
  ['iuvileinyi', 'проспект Ювілейний', 47.8166929, 35.0421194, 156980614],
  ['arabatskyi', 'Арабатський провулок', 47.8748179, 35.0257522, 360863548],
  ['balkhashskyi', 'Балхашський провулок', 47.8067691, 35.2331981, 379665599],
  ['bereznevyi', 'Березневий провулок', 47.862021, 34.9954937, 110249589],
  ['virnyi', 'Вірний провулок', 47.8553592, 34.9987134, 110249586],
  ['halytskyi', 'Галицький провулок', 47.8574775, 34.9986471, 110249547],
  ['hurzufskyi', 'Гурзуфський провулок', 47.8051733, 35.2316728, 185669318],
  ['himalaiskyi', 'Гімалайський провулок', 47.8582806, 35.0147374, 110249552],
  ['dniprorudnyi', 'Дніпрорудний провулок', 47.8664664, 34.9964134, 110249572],
  ['oleha-melnychenka', 'Олега Мельниченка провулок', 47.8497657, 35.0098492, 113291997],
  ['prokholodnyi', 'Прохолодний провулок', 47.8599054, 35.0129207, 110249569],
  ['spasivskyi', 'Спасівський провулок', 47.8651233, 35.000869, 880776625],
  ['tyraspolskyi', 'Тираспольський провулок', 47.8064284, 35.2266521, 132204400],
  ['khvyliasnyi', 'Хвилясний провулок', 47.814087, 35.2370167, 185669291],
  ['shyrshova', 'Ширшова провулок', 47.8637107, 35.1017344, 375909603],
  ['bakynskyi', 'провулок Бакинський', 47.8778351, 35.0320636, 110242848],
  ['berezovyi', 'провулок Березовий', 47.8734362, 35.0367551, 110242860],
  ['belforskyi', 'Бельфорський бульвар', 47.8731157, 35.0568007, 117331574],
  ['budivelnykiv', 'бульвар Будівельників', 47.8260757, 35.0274432, 112023749],
  ['heroiv-polku-azov', 'бульвар Героїв полку Азов', 47.8430065, 35.1060928, 164441100],
  ['marii-prymachenko', 'бульвар Марії Примаченко', 47.8421541, 35.1246364, 49038316],
  ['parkovyi', 'бульвар Парковий', 47.8632704, 35.0974642, 36902348],
  ['tsentralnyi', 'бульвар Центральний', 47.8344561, 35.1358086, 36537350],
  ['shevchenka', 'бульвар Шевченка', 47.8424553, 35.1055425, 163080383],
]);

test('reviewed Zaporizhzhia streets retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:zaporizhzhia:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:zaporizhzhia', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('nearby rural street hits remain excluded from Zaporizhzhia owners', () => {
  assert.equal(getGeoEntity('ua:zaporizhzhia:street:kvitkovyi'), null);
  assert.equal(getGeoEntity('ua:zaporizhzhia:street:kniazhyi'), null);
});
