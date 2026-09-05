const mappedResidential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 220) => Object.freeze({
  id: `kg:karakol:residential:${slug}`,
  type: 'residential_complex',
  country: 'KG',
  canonicalName,
  parentId: 'kg:karakol',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM,
});

export const KG_KARAKOL_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  mappedResidential('karakol-residence', 'Karakol Residence', 42.502785, 78.392431, 'https://2gis.kg/karakol/firm/70000001076253420'),
]);
