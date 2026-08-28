import { KZ_CITIES, TASHKENT_DISTRICTS, TASHKENT_AREAS } from '@whiteslove/parsing-lexicon/geo';
import { UA_CITIES } from '@whiteslove/parsing-lexicon/geography';
import { UA_REGIONAL_LOCATION_EXTENSIONS } from '@whiteslove/parsing-lexicon/ua-location-extensions-regional';
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
import { UZ_SECONDARY_COVERAGE_GAPS, isUzSecondaryCoverageGap } from '../src/coverage-gaps-uz-secondary.js';
import { UZ_TAIL_COVERAGE_GAPS, isUzTailCoverageGap } from '../src/coverage-gaps-uz-tail.js';

const tashkentAreas = Object.values(TASHKENT_AREAS).flat();
const typeByKey = Object.freeze({
  districts: 'district', microdistricts: 'microdistrict', mahallas: 'mahalla', localAreas: 'local_area', suburbs: 'suburb', settlements: 'settlement', metro: 'metro', residentialComplexes: 'residential_complex', streets: 'street', landmarks: 'poi', pois: 'poi',
});

function expandedCityEntries(city) {
  const data = UZ_EXPANDED_LOCATION_DICTIONARIES[city] || {};
  const rows = [];
  for (const [key, type] of Object.entries(typeByKey)) {
    for (const item of data[key] || []) rows.push({ item, type });
  }
  return rows;
}

const expandedGroup = (city) => [
  `${city} expanded geography`, expandedCityEntries(city),
  ({ item, type }) => ({ country: 'UZ', city, type, canonical: item.canonical || item.name }),
];

const uaRegionalGroup = (city, key, type) => [
  `${city} ${key}`, UA_REGIONAL_LOCATION_EXTENSIONS[city]?.[key] || [],
  (item) => ({ country: 'UA', city, type, canonical: item.canonical || item.name }),
];

const expandedUzCities = [
  'Samarkand','Namangan','Andijan','Fergana','Bukhara','Qarshi','Nukus','Urgench','Jizzakh','Navoiy','Termez','Gulistan','Chirchiq','Kokand','Margilan','Almalyk','Angren','Bekabad','Shakhrisabz','Khiva','Denov','Asaka','Kogon','Kattakurgan','Urgut','Yangiyol','Yangiyer','Shirin','Gazalkent','Chartak','Chust','Kosonsoy','Khojeyli','Takhiatash','Kungrad','Muynak','Beruniy','Turtkul','Shahrixon','Xonobod',
];

const groups = [
  ['UZ cities', UZ_CITY_CATALOG, (item) => ({ country: 'UZ', type: 'city', canonical: item.canonical })],
  ['KZ cities', KZ_CITIES, (item) => ({ country: 'KZ', type: 'city', canonical: item.canonical })],
  ['UA cities', UA_CITIES, (item) => ({ country: 'UA', type: 'city', canonical: item.canonical })],
  ['Tashkent districts', TASHKENT_DISTRICTS, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: item.canonical })],
  ['Tashkent areas', tashkentAreas, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: item.canonical })],
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
  ...expandedUzCities.map(expandedGroup),
];

const isTrackedGap = (input) => isGeoCoverageGap(input) || isKzCityCoverageGap(input) || isUaRegionalCoverageGap(input) || isUaRivneCoverageGap(input) || isUaKhersonCoverageGap(input) || isUaVinnytsiaCoverageGap(input) || isUaMykolaivCoverageGap(input) || isUaCherkasyCoverageGap(input) || isUzSecondaryCoverageGap(input) || isUzTailCoverageGap(input);
const allGaps = [...GEO_COVERAGE_GAPS, ...KZ_CITY_COVERAGE_GAPS, ...UA_REGIONAL_COVERAGE_GAPS, ...UA_RIVNE_COVERAGE_GAPS, ...UA_KHERSON_COVERAGE_GAPS, ...UA_VINNYTSIA_COVERAGE_GAPS, ...UA_MYKOLAIV_COVERAGE_GAPS, ...UA_CHERKASY_COVERAGE_GAPS, ...UZ_SECONDARY_COVERAGE_GAPS, ...UZ_TAIL_COVERAGE_GAPS];

let unaccounted = 0;
for (const [label, items, toInput] of groups) {
  const resolved = items.filter((item) => resolveLexiconGeoEntity(toInput(item)));
  const gaps = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && isTrackedGap(toInput(item)));
  const missing = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && !isTrackedGap(toInput(item)));
  console.log(`${label}: ${resolved.length}/${items.length} spatial, ${gaps.length} tracked gaps`);
  for (const item of missing) console.log(`  unaccounted: ${toInput(item).canonical}`);
  unaccounted += missing.length;
}

const staleGaps = allGaps.filter((gap) => resolveLexiconGeoEntity(gap));
for (const gap of staleGaps) console.log(`stale gap: ${gap.city || gap.country} / ${gap.canonical}`);

if (unaccounted > 0 || staleGaps.length > 0) {
  console.error(`Geo coverage audit failed: ${unaccounted} unaccounted entities, ${staleGaps.length} stale gaps.`);
  process.exitCode = 1;
} else {
  console.log('Parsing-lexicon geography is fully accounted for by spatial entities or explicit coverage gaps.');
}
