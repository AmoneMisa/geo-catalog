const sourcedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 180, extra = {}) => Object.freeze({
  id: `ua:kyiv:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
  ...extra,
});

const osmResidential = (slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 160) => Object.freeze({
  id: `ua:kyiv:residential:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kyiv',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  accuracy: 'building',
  accuracyM,
  osm: Object.freeze({ type: osmType, id: osmId }),
});

export const UA_KYIV_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  sourcedResidential('respublika', 'Respublika', 50.371046, 30.448216, 'https://novobudovy.com/novobudovy-kyieva/teremky/zhitlovij-kompleks-respublika-respublika-m-kiiv-kilceva-doroga', 220),
  sourcedResidential('french-quarter', 'French Quarter', 50.416927, 30.529375, 'https://novobudovy.com/novobudovy-kyieva/novobudovy-pecherskyi-raion/zhk-francuzkij-kvartal-m-kiiv-vul-barbiusa-kovpaka-copy', 180),
  osmResidential('french-quarter-2', 'French Quarter 2', 50.41533, 30.52629, 'way', 45489644, 180),
  sourcedResidential('novopecherski-lypky', 'Novopecherski Lypky', 50.4102, 30.545873, 'https://yandex.com/maps/143/kyiv/geo/zhytlovyi_kompleks_novopecherski_lypky/1724457490/', 180),
  sourcedResidential('taryan-towers', 'Taryan Towers', 50.419556, 30.533583, 'https://www.skyscraperpage.com/forum/showthread.php?t=241697', 140),
  sourcedResidential('fayna-town', 'Fayna Town', 50.467283, 30.401051, 'https://novobudovy.com/novobudovy-kyieva/novobudovy-shevchenkivskyi-raion/fajna-taun', 220),
  sourcedResidential('unit-home', 'UNIT.Home', 50.46656, 30.462732, 'https://novobudovy.com/novobudovy-kyieva/unit-home', 180),
  sourcedResidential('comfort-town', 'Comfort Town', 50.435524, 30.621906, 'https://archi.ru/projects/world/9167/zhiloi-kvartal-komfort-taun', 220),
  sourcedResidential('great', 'Great', 50.414846, 30.596114, 'https://novobudovy.com/novobudovy-kyieva/novobudova-m-kiiv-vul-urickogo-stadionna-copy-2-copy', 220),
]);
