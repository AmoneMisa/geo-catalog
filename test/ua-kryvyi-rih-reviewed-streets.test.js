import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';

const cases = Object.freeze([
  ['henerala-bezruchka', 'вулиця Генерала Безручка', 47.682835, 33.1574087, 107876120],
  ['sviato-voznesenska', 'Свято-Вознесенська вулиця', 47.840105, 33.3355786, 130863413],
  ['pelaheyi-lytvynovoi', 'вулиця Пелагеї Литвинової', 47.9212757, 33.3897083, 144061184],
  ['nyzova', 'Низова вулиця', 47.9434515, 33.3983467, 125305894],
  ['andyzhanska', 'Андижанська вулиця', 47.8423581, 33.3650812, 112701599],
  ['80-desantno-shturmovoi-bryhady', 'вулиця 80-ї Десантно-Штурмової Бригади', 47.931374, 33.3918973, 40065208],
  ['viry-nikitinoi', 'вулиця Віри Нікітіної', 48.0060719, 33.445421, 148603923],
  ['andreya-drobilenko', 'улица Андрея Дробиленко', 48.018772, 33.4771071, 148603732],
  ['sofii-rusovoi', 'Софии Русовой улица', 47.9189213, 33.4793709, 107420498],
  ['panasa-mirnogo', 'Панаса Мирного улица', 47.839668, 33.342358, 107610000],
  ['pochtovyi', 'Почтовый проспект', 47.9124309, 33.3485846, 37560654],
  ['pobedy', 'Победы проспект', 47.6842115, 33.1626355, 107876108],
  ['tsentralnyi', 'Центральный проспект', 47.9063765, 33.3474114, 431863589],
  ['ivana-nechuya-levitskogo', 'проспект Ивана Нечуя-Левицкого', 47.6830894, 33.1742879, 107876067],
  ['mira', 'проспект Мира', 47.9033331, 33.3600656, 431863599],
  ['telmana', 'провулок Тельмана', 47.8795954, 33.3552117, 115193555],
  ['rudnychnyi', 'Рудничний провулок', 48.0393514, 33.4940416, 740211404],
  ['himnazychnyi', 'Гімназичний провулок', 47.8392044, 33.4417276, 133474458],
  ['3-salskyi', '3-й Сальський провулок', 47.8379217, 33.4475242, 112818895],
  ['varshavskiy', 'Варшавский переулок', 48.0100989, 33.4547646, 148604025],
  ['bugskiy', 'Бугский переулок', 48.0169714, 33.4842727, 148603697],
  ['sergeya-baydaka', 'переулок Сергея Байдака', 48.0024624, 33.4631595, 148460718],
  ['ampera', 'переулок Ампера', 47.9797004, 33.4313779, 109373091],
  ['artekovskiy', 'Артековский переулок', 48.0010735, 33.4690908, 143215107],
  ['kozatska', 'Козацька вулиця', 47.9165953, 33.395481, 107327862],
  ['chekhoslovatska', 'Чехословацька вулиця', 47.9496786, 33.4067265, 125329007],
  ['nestora-makhna', 'вулиця Нестора Махна', 47.9718712, 33.4153894, 690225205],
  ['volonteriv', 'вулиця Волонтерів', 47.9439045, 33.3933441, 111996288],
  ['karagandynska', 'Карагандинська вулиця', 47.8998213, 33.3455286, 115193653],
  ['kamenodrobylna', 'Каменедробильна вулиця', 47.8974607, 33.2757674, 118456258],
  ['goyi', 'вулиця Гойї', 47.922545, 33.4596763, 1257200038],
  ['repina', 'Репина улица', 47.8890633, 33.287695, 107546515],
  ['kostya-gordienko', 'Костя Гордиенко улица', 47.999391, 33.4497132, 166646250],
  ['yuzhnyi', 'Южный проспект', 47.8502304, 33.3554112, 432919994],
  ['universitetskiy', 'Университетский проспект', 47.9078451, 33.4199135, 1019088388],
  ['200-letiya-kryvogo-roga', '200-летия Кривого Рога проспект', 47.9608447, 33.4360208, 827285414],
  ['ekonomichnyi', 'Економічний провулок', 47.9269203, 33.3364435, 116936880],
  ['azovskyi', 'Азовський провулок', 47.9116416, 33.3552509, 115354314],
  ['rubinovyi', 'Рубіновий провулок', 47.9081953, 33.3576733, 139220205],
  ['slavy-lane', 'провулок Слави', 47.9339533, 33.3461825, 115365909],
  ['grushevskogo', 'Грушевского переулок', 47.8941595, 33.4650223, 107420423],
  ['kazaka-roga', 'переулок Казака Рога', 47.9086246, 33.3381045, 115193596],
  ['novolozovatskiy', 'Новолозоватский переулок', 47.9219589, 33.3223503, 140172487],
]);

test('reviewed Kryvyi Rih streets retain representative OSM way provenance', () => {
  for (const [slug, canonicalName, lat, lng, osmId] of cases) {
    const id = `ua:kryvyi-rih:street:${slug}`;
    const entity = getGeoEntity(id);
    assert.ok(entity, id);
    assert.equal(entity.type, 'street', id);
    assert.equal(entity.country, 'UA', id);
    assert.equal(entity.canonicalName, canonicalName, id);
    assert.equal(entity.parentId, 'ua:kryvyi-rih', id);
    assert.deepEqual(entity.center, { lat, lng }, id);
    assert.equal(entity.source, 'osm', id);
    assert.equal(entity.sourceUrl, `https://www.openstreetmap.org/way/${osmId}`, id);
    assert.deepEqual(entity.osm, { type: 'way', id: osmId }, id);
  }
});

test('generic and non-street Kryvyi Rih scrape hits remain excluded', () => {
  for (const id of [
    'ua:kryvyi-rih:street:bulvar',
    'ua:kryvyi-rih:street:vecherniy-bulvar',
    'ua:kryvyi-rih:street:ploshchad-95-kvartal',
    'ua:kryvyi-rih:street:ploshcha-svobody',
  ]) {
    assert.equal(getGeoEntity(id), null, id);
  }
});
