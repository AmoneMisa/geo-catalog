import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const expected = [
  'kg:bishkek:street:chyngyz-aytmatov-avenue',
  'kg:bishkek:street:aaly-tokombayev-avenue',
  'kg:bishkek:street:manas-avenue',
  'kg:bishkek:street:chui-avenue',
  'kg:bishkek:street:baitik-baatyr',
  'kg:bishkek:street:nasirdin-isanov',
  'kg:bishkek:street:ibraimov',
  'kg:bishkek:street:toktogul',
  'kg:bishkek:street:joomart-bokonbayev',
  'kg:bishkek:street:jusup-abdrakhmanov',
  'kg:bishkek:street:shopokov',
  'kg:bishkek:street:jibek-jolu-avenue',
  'kg:bishkek:street:usenbaev',
  'kg:bishkek:street:yunusaliev',
  'kg:bishkek:street:erkindik-boulevard',
  'kg:bishkek:street:moskovskaya',
  'kg:bishkek:street:bakaev',
  'kg:bishkek:street:jantoshev',
  'kg:bishkek:street:sukhe-bator',
  'kg:bishkek:street:pavlov',
  'kg:bishkek:street:zhukeev-pudovkin',
  'kg:bishkek:street:gorky',
  'kg:bishkek:street:orozbekov',
  'kg:bishkek:street:kievskaya',
  'kg:bishkek:street:panfilov',
  'kg:bishkek:street:togolok-moldo',
  'kg:bishkek:street:umetaliev',
  'kg:bishkek:street:molodaya-gvardiya-boulevard',
  'kg:bishkek:street:asankul-kutubbaev',
  'kg:bishkek:street:imanaliev',
  'kg:bishkek:street:matrosov',
  'kg:bishkek:street:mederov',
  'kg:bishkek:street:chokan-valikhanov',
  'kg:bishkek:street:pobedy-avenue',
  'kg:bishkek:street:seitek',
  'kg:bishkek:street:aitiev',
  'kg:bishkek:street:jamanbaev',
  'kg:bishkek:street:ayni',
  'kg:bishkek:street:toktonaliev',
  'kg:bishkek:street:moldobasanov',
  'kg:bishkek:street:sayakbay-karalaev',
  'kg:bishkek:street:lev-tolstoy',
  'kg:bishkek:street:sadygaliev',
  'kg:bishkek:street:kainazarova',
  'kg:bishkek:street:samanchin',
  'kg:bishkek:street:kalyk-akiev',
  'kg:bishkek:street:mikhail-frunze',
  'kg:bishkek:street:kurchatov',
  'kg:bishkek:street:kopernik',
  'kg:bishkek:street:orto',
  'kg:bishkek:street:matisakov',
  'kg:bishkek:street:karasaev',
  'kg:bishkek:street:sadyrbaev',
  'kg:bishkek:street:yrys',
  'kg:bishkek:street:dordoi',
  'kg:bishkek:street:altyn-ordo',
  'kg:bishkek:street:army',
  'kg:bishkek:street:sheraliev',
  'kg:bishkek:street:sherbet',
  'kg:bishkek:street:repin',
  'kg:bishkek:street:min-kush',
  'kg:bishkek:street:murmanskaya',
  'kg:bishkek:street:valdayskaya',
  'kg:bishkek:street:ala-archinskaya',
];

test('Bishkek canonical street entities expose verified centers', () => {
  for (const id of expected) {
    const entity = getGeoEntity(id);
    assert.ok(entity, `${id} should exist`);
    assert.equal(entity.type, 'street');
    assert.equal(entity.country, 'KG');
    assert.equal(entity.parentId, 'kg:bishkek');
    assert.ok(Number.isFinite(entity.center?.lat), `${id} lat`);
    assert.ok(Number.isFinite(entity.center?.lng), `${id} lng`);
    assert.notEqual(entity.center.lat, 0);
    assert.notEqual(entity.center.lng, 0);
    assert.ok(entity.sourceUrl, `${id} sourceUrl`);
  }
});

test('historical Mira Avenue is an alias, not a second geo entity', () => {
  assert.equal(getGeoEntity('kg:bishkek:street:mira-avenue'), null);
  assert.ok(getGeoEntity('kg:bishkek:street:chyngyz-aytmatov-avenue'));
});
