const TARAZ_DISTRICT_ACT = 'https://adilet.zan.kz/rus/docs/G25G0000212';

const district = (slug, canonicalName, lat, lng, accuracyM) => Object.freeze({
  id: `kz:taraz:district:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:taraz',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl: TARAZ_DISTRICT_ACT,
  accuracy: 'district',
  accuracyM,
});

export const KZ_TARAZ_DISTRICT_ENTITIES = Object.freeze([
  // The 2025 act defines Aulieata as the northern district and Zhibek Zholy as the southern district.
  // Until authoritative boundary geometry is available, keep broad representative centers instead of fake precision.
  district('aulieata', 'Aulieata', 42.930, 71.365, 18000),
  district('zhibek-zholy', 'Zhibek Zholy', 42.875, 71.365, 18000),
]);
