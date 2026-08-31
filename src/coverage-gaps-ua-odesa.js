export const UA_ODESA_COVERAGE_GAPS = Object.freeze([]);

const keys = new Set(UA_ODESA_COVERAGE_GAPS.map(({ country, city, type, canonical }) => `${country}|${city}|${type}|${canonical}`));

export function isUaOdesaCoverageGap({ country, city, type, canonical }) {
  return keys.has(`${country}|${city}|${type}|${canonical}`);
}
