const wikidataDistrict = (slug, canonicalName, lat, lng, wikidataId, accuracyM = 6000, osm = null) => ({
  id: `kz:almaty:${slug}`,
  type: 'district',
  country: 'KZ',
  canonicalName,
  parentId: 'kz:almaty',
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'district',
  accuracyM,
  wikidataId,
  ...(osm ? { osm } : {}),
});

export const ALMATY_DISTRICT_ENTITIES = Object.freeze([
  wikidataDistrict('alatau', 'Alatau', 43.293333, 76.829167, 'Q16533408', 7000),
  wikidataDistrict('almaly', 'Almaly', 43.250000, 76.900000, 'Q16533574', 4500),
  wikidataDistrict('auezov', 'Auezov', 43.224444, 76.847222, 'Q16534658', 5000),
  wikidataDistrict('bostandyk', 'Bostandyk', 43.200000, 76.900000, 'Q16627789', 7000, { type: 'relation', id: 3390291 }),
  {
    id: 'kz:almaty:zhetysu',
    type: 'district',
    country: 'KZ',
    canonicalName: 'Zhetysu',
    parentId: 'kz:almaty',
    center: { lat: 43.287262, lng: 76.923187 },
    source: 'manual',
    accuracy: 'approximate',
    accuracyM: 6500,
  },
  wikidataDistrict('medeu', 'Medeu', 43.250000, 76.950000, 'Q4287636', 9000, { type: 'relation', id: 3072217 }),
  wikidataDistrict('nauryzbay', 'Nauryzbay', 43.166667, 76.833333, 'Q18405618', 8000, { type: 'relation', id: 5460063 }),
  wikidataDistrict('turksib', 'Turksib', 43.350000, 77.000000, 'Q4466184', 8000, { type: 'relation', id: 3072001 }),
]);
