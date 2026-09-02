import routeRows from '../src/transport/generated/tashkent-minibus-easyway-routes.js';
import {
  TASHKENT_MINIBUS_OFFICIAL_REGISTRY,
  TASHKENT_MINIBUS_OFFICIAL_SOURCE,
} from '../src/transport/tashkent-minibus-official-registry.js';

export const normalizeMinibusRef = (value) => String(value ?? '')
  .normalize('NFKC')
  .trim()
  .toLowerCase()
  .replace(/[мm]$/u, 'm')
  .replace(/[иi]$/u, 'i');

const sortRefs = (refs) => [...refs].sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
);

const officialRefs = TASHKENT_MINIBUS_OFFICIAL_REGISTRY.map((row) => normalizeMinibusRef(row.ref));
const easywayRefs = routeRows.map(([ref]) => normalizeMinibusRef(ref));
const officialSet = new Set(officialRefs);
const easywaySet = new Set(easywayRefs);

const matched = sortRefs([...officialSet].filter((ref) => easywaySet.has(ref)));
const officialOnly = sortRefs([...officialSet].filter((ref) => !easywaySet.has(ref)));
const easywayOnly = sortRefs([...easywaySet].filter((ref) => !officialSet.has(ref)));

const failures = [];
if (officialRefs.some((ref) => !ref)) failures.push('official registry contains an empty route ref');
if (officialSet.size !== officialRefs.length) {
  failures.push(`official registry refs are not unique: ${officialSet.size}/${officialRefs.length}`);
}
if (easywaySet.size !== easywayRefs.length) {
  failures.push(`EasyWay snapshot refs are not unique: ${easywaySet.size}/${easywayRefs.length}`);
}
if (TASHKENT_MINIBUS_OFFICIAL_SOURCE.license !== 'CC BY 4.0') {
  failures.push(`unexpected official-source license: ${TASHKENT_MINIBUS_OFFICIAL_SOURCE.license}`);
}

console.log('Tashkent minibus source reconciliation');
console.log(`  official published rows: ${officialRefs.length}`);
console.log(`  EasyWay snapshot routes: ${easywayRefs.length}`);
console.log(`  matched refs: ${matched.length}`);
console.log(`  official-only refs: ${officialOnly.length} -> ${officialOnly.join(', ') || '(none)'}`);
console.log(`  EasyWay-only refs: ${easywayOnly.length} -> ${easywayOnly.join(', ') || '(none)'}`);
console.log('  note: official page contract dates are metadata only; expired dates do not automatically mean inactive.');
console.log('  benchmark: the Transport Administration H1 2026 report states 33 route-taxi routes under oversight.');

if (failures.length) {
  for (const failure of failures) console.error(`Minibus source audit failed: ${failure}`);
  process.exitCode = 1;
}
