function normalizePart(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[’ʼʻ`]/gu, "'")
    .replace(/[‐‑‒–—―]/gu, '-')
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/\s+/gu, ' ')
    .replace(/\|/gu, ' ');
}

function compactNumber(value) {
  return normalizePart(value).replace(/\s+/gu, '');
}

/**
 * Stable key shared by runtime learned_geo rows and package entities.
 * Callers should pass canonical city/street/entity names whenever the parser
 * knows them. The function deliberately contains no aliases or coordinates.
 */
export function buildGeoLookupKey(parts = {}) {
  const country = String(parts.country ?? '').trim().toUpperCase();
  const type = normalizePart(parts.type || 'address');
  if (!country || !type) return null;

  const values = type === 'address'
    ? [
        normalizePart(parts.city),
        normalizePart(parts.district),
        normalizePart(parts.street),
        compactNumber(parts.houseNumber),
        compactNumber(parts.building),
      ]
    : [
        normalizePart(parts.city),
        normalizePart(parts.district),
        normalizePart(parts.canonical || parts.name || parts.street),
      ];

  if (!values.some(Boolean)) return null;
  return ['v1', country, type, ...values].join('|');
}
