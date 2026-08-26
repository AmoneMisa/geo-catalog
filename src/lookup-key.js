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
 *
 * Inferred districts are deliberately excluded. A district may be absent,
 * corrected later or crossed by the same street; none of those cases should
 * create a second immutable coordinate for the same canonical object.
 * Callers should pass canonical city/street/entity names whenever available.
 */
export function buildGeoLookupKey(parts = {}) {
  const country = String(parts.country ?? '').trim().toUpperCase();
  const type = normalizePart(parts.type || 'address');
  if (!country || !type) return null;

  const city = normalizePart(parts.city);
  const values = type === 'address'
    ? [
        city,
        normalizePart(parts.street),
        compactNumber(parts.houseNumber),
        compactNumber(parts.building),
      ]
    : [
        city,
        normalizePart(parts.canonical || parts.name || parts.street),
      ];

  if (!values.some(Boolean)) return null;
  return ['v1', country, type, ...values].join('|');
}
