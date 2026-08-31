const gap = (canonical, reason) => Object.freeze({
  country: 'UA',
  city: 'Odesa',
  type: 'microdistrict',
  canonical,
  reason,
});

export const UA_ODESA_COVERAGE_GAPS = Object.freeze([
  gap('Center', 'Listing canonical is an informal central-area label; no single verified microdistrict anchor is authoritative enough yet.'),
  gap('Zolotyi Bereh', 'The verified geo owner is the Zolotyi Bereh beach POI; the wider listing-area boundary/anchor is not yet verified.'),
  gap('Zastava-1', 'Current geo data verifies the broader Zastava neighborhood only; Zastava-1 needs its own sourced spatial owner.'),
  gap('Zastava-2', 'Current geo data verifies the broader Zastava neighborhood only; Zastava-2 needs its own sourced spatial owner.'),
]);

const keys = new Set(UA_ODESA_COVERAGE_GAPS.map(({ country, city, type, canonical }) => `${country}|${city}|${type}|${canonical}`));

export function isUaOdesaCoverageGap({ country, city, type, canonical }) {
  return keys.has(`${country}|${city}|${type}|${canonical}`);
}
