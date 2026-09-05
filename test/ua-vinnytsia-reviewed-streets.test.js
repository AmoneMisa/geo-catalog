import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['svobody-boulevard', 'Свободы бульвар', 49.2207163, 28.4486408, 131723484],
  ['marko-vovchok-boulevard', 'Марко Вовчок бульвар', 49.2604742, 28.5216432, 106361517],
  ['ivana-svitlychnoho-lane', 'провулок Івана Світличного', 49.2604782, 28.523814, 106361488],
  ['ulasa-samchuka', 'вулиця Уласа Самчука', 49.2547389, 28.4584711, 46340383],
  ['olgi-kobylyanskoy', 'Ольги Кобылянской улица', 49.2564397, 28.4597217, 35283026],
  ['marii-gavrish', 'Марии Гавриш улица', 49.2553198, 28.4596428, 360986264],
  ['avgustovskaya', 'Августовская улица', 49.2577248, 28.4454393, 108094437],
  ['dneprovskaya', 'Днепровская улица', 49.258109, 28.4634672, 44216381],
  ['yunosti-avenue', 'Юности проспект', 49.2235825, 28.4112052, 164792110],
  ['kosmonavtiv-avenue', 'проспект Космонавтів', 49.2224067, 28.4201193, 164792105],
  ['kotsyubinskogo-avenue', 'Коцюбинского проспект', 49.2392096, 28.4970295, 1530540145],
  ['2-tetyany-yablonskoi-lane', '2-й провулок Тетяни Яблонської', 49.20932, 28.5023829, 65624100],
  ['1-tetyany-yablonskoi-lane', '1-й провулок Тетяни Яблонської', 49.2092859, 28.5014575, 409532274],
  ['1-vostochnyy-lane', '1-й Восточный переулок', 49.2516112, 28.5563482, 136997523],
  ['privokzalnyy-lane', 'Привокзальный переулок', 49.2181382, 28.5044008, 151337106],
  ['1-botanicheskiy-lane', '1-й Ботанический переулок', 49.2542062, 28.4517901, 108094417],
  ['3-rudanskogo-lane', '3-й Руданского переулок', 49.2529192, 28.4550007, 47422314],
  ['igorya-savchenko-lane', 'Игоря Савченко переулок', 49.2537871, 28.5556362, 500415456],
  ['2-botanicheskiy-lane', '2-й Ботанический переулок', 49.2521897, 28.4566807, 47422312],
  ['2-odesskiy-lane', '2-й Одесский переулок', 49.2099559, 28.5049616, 65624123],
]);

test('reviewed Vinnytsia streets retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:vinnytsia:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:vinnytsia', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('Vinnytsia POI and square search hits remain excluded from street owners', () => {
  for (const id of [
    'ua:vinnytsia:street:tsentralnyi-avtovokzal',
    'ua:vinnytsia:street:fontanna-ploshcha',
    'ua:vinnytsia:street:ploshcha-tarasa-shevchenka',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
