const district = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `ua:kropyvnytskyi:district:${slug}`,
  type: 'district',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kropyvnytskyi',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'district',
  accuracyM,
  sourceUrl,
});

// Current city division is exactly two administrative districts: Podilskyi and Fortechnyi.
// Kropyvnytskyi City Council still documents both district councils in 2026; representative
// centers below are conservative locality centers, not invented polygon boundaries.
export const UA_KROPYVNYTSKYI_DISTRICT_ENTITIES = Object.freeze([
  district('podilskyi', 'Podilskyi', 48.5036, 32.2804, 7000, 'https://mapcarta.com/39438742'),
  district('fortechnyi', 'Fortechnyi', 48.4987, 32.2537, 7000, 'https://mapcarta.com/39438740'),
]);
