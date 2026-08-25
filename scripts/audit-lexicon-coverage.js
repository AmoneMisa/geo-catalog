import { UZ_CITIES, KZ_CITIES, TASHKENT_DISTRICTS } from '@whiteslove/parsing-lexicon/geo';
import { UA_CITIES } from '@whiteslove/parsing-lexicon/geography';
import { resolveLexiconGeoEntity } from '../src/lexicon-bridge.js';

const groups = [
  ['UZ cities', UZ_CITIES, (item) => ({ country: 'UZ', type: 'city', canonical: item.canonical })],
  ['KZ cities', KZ_CITIES, (item) => ({ country: 'KZ', type: 'city', canonical: item.canonical })],
  ['UA cities', UA_CITIES, (item) => ({ country: 'UA', type: 'city', canonical: item.canonical })],
  ['Tashkent districts', TASHKENT_DISTRICTS, (item) => ({ country: 'UZ', city: 'Tashkent', type: 'district', canonical: item.canonical })],
];

let missing = 0;
for (const [label, items, toInput] of groups) {
  const uncovered = items.filter((item) => !resolveLexiconGeoEntity(toInput(item)));
  const covered = items.length - uncovered.length;
  console.log(`${label}: ${covered}/${items.length} (${Math.round((covered / items.length) * 100)}%)`);
  for (const item of uncovered) console.log(`  missing: ${item.canonical}`);
  missing += uncovered.length;
}

if (missing > 0) {
  console.error(`Geo catalog is missing ${missing} canonical parsing-lexicon entities.`);
  process.exitCode = 1;
} else {
  console.log('Core parsing-lexicon geography coverage is complete.');
}
