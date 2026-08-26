import { UZ_CITIES, KZ_CITIES, TASHKENT_DISTRICTS, TASHKENT_AREAS } from '@whiteslove/parsing-lexicon/geo';
import { UA_CITIES } from '@whiteslove/parsing-lexicon/geography';
import { UZ_EXPANDED_LOCATION_DICTIONARIES } from '@whiteslove/parsing-lexicon/central-asia-locations';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';
import { GEO_COVERAGE_GAPS, isGeoCoverageGap } from '../src/coverage-gaps.js';

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
  `${city} expanded geography`,
  expandedCityEntries(city),
  ({ item, type }) => ({ country: 'UZ', city, type, canonical: item.canonical || item.name }),
];

const groups = [
  ['UZ cities', UZ_CITIES, (item) => ({ country: 'UZ', type: 'city', canonical: item.canonical })],
  ['KZ cities', KZ_CITIES, (item) => ({ country: 'KZ', type: 'city', canonical: item.canonical })],
  ['UA cities', UA_CITIES, (item) => ({ country: 'UA', type: 'city', canonical: item.canonical })],
  ['Tashkent districts', TASHKENT_DISTRICTS, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: item.canonical })],
  ['Tashkent areas', tashkentAreas, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'local_area', canonical: item.canonical })],
  expandedGroup('Samarkand'), expandedGroup('Namangan'), expandedGroup('Andijan'), expandedGroup('Fergana'), expandedGroup('Bukhara'),
];

let unaccounted = 0;
for (const [label, items, toInput] of groups) {
  const resolved = items.filter((item) => resolveLexiconGeoEntity(toInput(item)));
  const gaps = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && isGeoCoverageGap(toInput(item)));
  const missing = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)) && !isGeoCoverageGap(toInput(item)));
  console.log(`${label}: ${resolved.length}/${items.length} spatial, ${gaps.length} tracked gaps`);
  for (const item of missing) console.log(`  unaccounted: ${toInput(item).canonical}`);
  unaccounted += missing.length;
}

const staleGaps = GEO_COVERAGE_GAPS.filter((gap) => resolveLexiconGeoEntity(gap));
for (const gap of staleGaps) console.log(`stale gap: ${gap.city || gap.country} / ${gap.canonical}`);

if (unaccounted > 0 || staleGaps.length > 0) {
  console.error(`Geo coverage audit failed: ${unaccounted} unaccounted entities, ${staleGaps.length} stale gaps.`);
  process.exitCode = 1;
} else {
  console.log('Parsing-lexicon geography is fully accounted for by spatial entities or explicit coverage gaps.');
}
