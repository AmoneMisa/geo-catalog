import { KZ_CITIES, TASHKENT_DISTRICTS, TASHKENT_AREAS } from '@whiteslove/parsing-lexicon/geo';
import { UA_CITIES } from '@whiteslove/parsing-lexicon/geography';
import { UA_REGIONAL_LOCATION_EXTENSIONS } from '@whiteslove/parsing-lexicon/ua-location-extensions-regional';
import { UA_MAJOR_LOCATION_EXTENSIONS } from '@whiteslove/parsing-lexicon/ua-location-extensions-major';
import { UZ_CITY_CATALOG } from '@whiteslove/parsing-lexicon/central-asia';
import { UZ_EXPANDED_LOCATION_DICTIONARIES } from '@whiteslove/parsing-lexicon/central-asia-locations';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { GEO_COVERAGE_GAPS, isGeoCoverageGap } from '../src/coverage-gaps.js';
import { KZ_CITY_COVERAGE_GAPS, isKzCityCoverageGap } from '../src/coverage-gaps-kz-cities.js';
import { UA_REGIONAL_COVERAGE_GAPS, isUaRegionalCoverageGap } from '../src/coverage-gaps-ua-regional.js';
import { UA_RIVNE_COVERAGE_GAPS, isUaRivneCoverageGap } from '../src/coverage-gaps-ua-rivne.js';
import { UA_KHERSON_COVERAGE_GAPS, isUaKhersonCoverageGap } from '../src/coverage-gaps-ua-kherson.js';
import { UA_VINNYTSIA_COVERAGE_GAPS, isUaVinnytsiaCoverageGap } from '../src/coverage-gaps-ua-vinnytsia.js';
import { UA_MYKOLAIV_COVERAGE_GAPS, isUaMykolaivCoverageGap } from '../src/coverage-gaps-ua-mykolaiv.js';
import { UA_CHERKASY_COVERAGE_GAPS, isUaCherkasyCoverageGap } from '../src/coverage-gaps-ua-cherkasy.js';
import { UA_POLTAVA_COVERAGE_GAPS, isUaPoltavaCoverageGap } from '../src/coverage-gaps-ua-poltava.js';
import { UA_CHERNIHIV_COVERAGE_GAPS, isUaChernihivCoverageGap } from '../src/coverage-gaps-ua-chernihiv.js';
import { UZ_SECONDARY_COVERAGE_GAPS, isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';
import { UZ_TAIL_COVERAGE_GAPS, isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const tashkentAreas = Object.entries(TASHKENT_AREAS).flatMap(([district, items]) =>
  items.map((item) => ({ item, district })),
);
const typeByKey = Object.freeze({
  districts: 'district', microdistricts: 'microdistrict', mahallas: 'mahalla', localAreas: 'local_area', suburbs: 'suburb', settlements: 'settlement', developmentAreas: 'development_area', metro: 'metro', residentialComplexes: 'residential_complex', streets: 'street', landmarks: 'poi', pois: 'poi',
});

function expandedCityEntries(city, keys = Object.keys(typeByKey)) {
  const data = UZ_EXPANDED_LOCATION_DICTIONARIES[city] || {};
  const rows = [];
  for (const key of keys) {
    const type = typeByKey[key];
    if (!type) continue;
    for (const item of data[key] || []) rows.push({ item, type, key });
  }
  return rows;
}

const expandedGroup = (city, keys) => [
  `${city} expanded geography`, expandedCityEntries(city, keys),
  ({ item, type }) => ({ country: 'UZ', city, type, canonical: item.canonical || item.name }),
];

const uaRegionalGroup = (city, key, type) => [
  `${city} ${key}`, UA_REGIONAL_LOCATION_EXTENSIONS[city]?.[key] || [],
  (item) => ({ country: 'UA', city, type, canonical: item.canonical || item.name }),
];

const uaMajorGroup = (city, key, type) => [
  `${city} ${key}`, UA_MAJOR_LOCATION_EXTENSIONS[city]?.[key] || [],
  (item) => ({ country: 'UA', city, type, canonical: item.canonical || item.name }),
];

const expandedUzCities = [
  'Samarkand','Namangan','Andijan','Fergana','Bukhara','Qarshi','Nukus','Urgench','Jizzakh','Navoiy','Termez','Gulistan','Chirchiq','Kokand','Margilan','Almalyk','Angren','Bekabad','Shakhrisabz','Khiva','Denov','Asaka','Kogon','Kattakurgan','Urgut','Yangiyol','Yangiyer','Shirin','Gazalkent','Chartak','Chust','Kosonsoy','Khojeyli','Takhiatash','Kungrad','Muynak','Beruniy','Turtkul','Shahrixon','Xonobod',
];
const tashkentSemanticKeys = Object.freeze(['microdistricts', 'mahallas', 'localAreas', 'developmentAreas']);

const groups = [
  ['UZ cities', UZ_CITY_CATALOG, (item) => ({ country: 'UZ', type: 'city', canonical: item.canonical })],
  ['KZ cities', KZ_CITIES, (item) => ({ country: 'KZ', type: 'city', canonical: item.canonical })],
  ['UA cities', UA_CITIES, (item) => ({ country: 'UA', type: 'city', canonical: item.canonical })],
  ['Tashkent districts', TASHKENT_DISTRICTS, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: item.canonical })],
  ['Tashkent typed areas', tashkentAreas, ({ item }) => ({ country: 'UZ', city: 'Tashkent', type: item.type || 'local_area', canonical: item.canonical })],
  expandedGroup('Tashkent', tashkentSemanticKeys),
  ...['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Zaporizhzhia', 'Kryvyi Rih']
    .map((city) => uaMajorGroup(city, 'districts', 'district')),
  uaRegionalGroup('Chernivtsi', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Chernivtsi', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Chernivtsi', 'landmarks', 'poi'),
  uaRegionalGroup('Kropyvnytskyi', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Kropyvnytskyi', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Kropyvnytskyi', 'landmarks', 'poi'),
  uaRegionalGroup('Kremenchuk', 'districts', 'district'),
  uaRegionalGroup('Kremenchuk', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Kremenchuk', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Kremenchuk', 'landmarks', 'poi'),
  uaRegionalGroup('Bila Tserkva', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Bila Tserkva', 'landmarks', 'poi'),
  uaRegionalGroup('Rivne', 'districts', 'district'),
  uaRegionalGroup('Rivne', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Rivne', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Rivne', 'landmarks', 'poi'),
  uaRegionalGroup('Kherson', 'districts', 'district'),
  uaRegionalGroup('Kherson', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Kherson', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Kherson', 'landmarks', 'poi'),
  uaRegionalGroup('Vinnytsia', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Vinnytsia', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Vinnytsia', 'landmarks', 'poi'),
  uaRegionalGroup('Mykolaiv', 'districts', 'district'),
  uaRegionalGroup('Mykolaiv', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Mykolaiv', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Mykolaiv', 'landmarks', 'poi'),
  uaRegionalGroup('Cherkasy', 'districts', 'district'),
  uaRegionalGroup('Cherkasy', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Cherkasy', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Cherkasy', 'landmarks', 'poi'),
  uaRegionalGroup('Poltava', 'districts', 'district'),
  uaRegionalGroup('Poltava', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Poltava', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Poltava', 'landmarks', 'poi'),
  uaRegionalGroup('Chernihiv', 'districts', 'district'),
  uaRegionalGroup('Chernihiv', 'microdistricts', 'microdistrict'),
  uaRegionalGroup('Chernihiv', 'residentialComplexes', 'residential_complex'),
  uaRegionalGroup('Chernihiv', 'landmarks', 'poi'),
  ...expandedUzCities.map((city) => expandedGroup(city)),
];

const isTrackedGap = (input) => isGeoCoverageGap(input) || isKzCityCoverageGap(input) || isUaRegionalCoverageGap(input) || isUaRivneCoverageGap(input) || isUaKhersonCoverageGap(input) || isUaVinnytsiaCoverageGap(input) || isUaMykolaivCoverageGap(input) || isUaCherkasyCoverageGap(input) || isUaPoltavaCoverageGap(input) || isUaChernihivCoverageGap(input) || isUzSecondaryCoverageGap(input) || isUzTailCoverageGap(input);
const allGaps = [...GEO_COVERAGE_GAPS, ...KZ_CITY_COVERAGE_GAPS, ...UA_REGIONAL_COVERAGE_GAPS, ...UA_RIVNE_COVERAGE_GAPS, ...UA_KHERSON_COVERAGE_GAPS, ...UA_VINNYTSIA_COVERAGE_GAPS, ...UA_MYKOLAIV_COVERAGE_GAPS, ...UA_CHERKASY_COVERAGE_GAPS, ...UA_POLTAVA_COVERAGE_GAPS, ...UA_CHERNIHIV_COVERAGE_GAPS, ...UZ_SECONDARY_COVERAGE_GAPS, ...UZ_TAIL_COVERAGE_GAPS];

let unaccounted = 0;
for (const [label, items, toInput] of groups) {
  const resolved = items.filter((item) => resolveLexiconGeoEntity(toInput(item)));
  const gaps = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && isTrackedGap(toInput(item)));
  const missing = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && !isTrackedGap(toInput(item)));
  console.log(`${label}: ${resolved.length}/${items.length} spatial, ${gaps.length} tracked gaps`);
  for (const item of missing) console.log(`  unaccounted: ${toInput(item).canonical}`);
  unaccounted += missing.length;
}

let parentMismatches = 0;
function auditTashkentParent(input, parentCanonical, label) {
  if (!parentCanonical) return;
  const entity = resolveLexiconGeoEntity(input);
  if (!entity) return;
  const parent = resolveLexiconGeoEntity({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: parentCanonical });
  if (!parent) {
    console.log(`  parent unresolved: ${label} -> ${parentCanonical}`);
    parentMismatches += 1;
    return;
  }
  if (entity.parentId !== parent.id) {
    console.log(`  parent mismatch: ${label} -> ${entity.parentId || '(none)'}, expected ${parent.id}`);
    parentMismatches += 1;
  }
}

for (const { item, district } of tashkentAreas) {
  auditTashkentParent(
    { country: 'UZ', city: 'Tashkent', type: item.type || 'local_area', canonical: item.canonical },
    district,
    `Tashkent area ${item.canonical}`,
  );
}
for (const { item, type } of expandedCityEntries('Tashkent', tashkentSemanticKeys)) {
  if (!item.parent) continue;
  auditTashkentParent(
    { country: 'UZ', city: 'Tashkent', type, canonical: item.canonical || item.name },
    item.parent,
    `Tashkent ${type} ${item.canonical || item.name}`,
  );
}

const staleGaps = allGaps.filter((gap) => resolveLexiconGeoEntity(gap));
for (const gap of staleGaps) console.log(`stale gap: ${gap.city || gap.country} / ${gap.canonical}`);

if (unaccounted > 0 || staleGaps.length > 0 || parentMismatches > 0) {
  console.error(`Geo coverage audit failed: ${unaccounted} unaccounted entities, ${staleGaps.length} stale gaps, ${parentMismatches} parent mismatches.`);
  process.exitCode = 1;
} else {
  console.log('Parsing-lexicon geography is fully accounted for by spatial entities or explicit coverage gaps, with Tashkent semantic parents aligned.');
}
