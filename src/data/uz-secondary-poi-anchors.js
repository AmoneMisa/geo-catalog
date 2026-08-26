const osmPoi = (citySlug, slug, canonicalName, lat, lng, osmType, osmId, accuracyM = 140, wikidataId = null) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'osm',
  accuracy: 'poi',
  accuracyM,
  osm: { type: osmType, id: osmId },
  ...(wikidataId ? { wikidataId } : {}),
});

const wikidataPoi = (citySlug, slug, canonicalName, lat, lng, wikidataId, accuracyM = 180) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'wikidata',
  accuracy: 'poi',
  accuracyM,
  wikidataId,
});

const sourcedPoi = (citySlug, slug, canonicalName, lat, lng, sourceUrl, accuracyM = 220) => ({
  id: `uz:${citySlug}:poi:${slug}`,
  type: 'poi',
  country: 'UZ',
  canonicalName,
  parentId: `uz:${citySlug}`,
  center: { lat, lng },
  source: 'manual',
  accuracy: 'poi',
  accuracyM,
  sourceUrl,
});

export const UZ_SECONDARY_POI_ANCHORS = Object.freeze([
  osmPoi('margilan', 'kumtepa-bazaar', 'Kumtepa Bazaar', 40.45504, 71.66594, 'way', 253749024, 180),
  osmPoi('almalyk', 'metallurg-stadium', 'Metallurg Stadium', 40.84495, 69.60070, 'way', 257413698, 170, 'Q5927465'),
  osmPoi('kokand', 'kokand-bazaar', 'Kokand Bazaar', 40.55218, 70.95907, 'way', 174506939, 190),
  wikidataPoi('navoiy', 'farhod-palace-of-culture', 'Farhod Palace of Culture', 40.094, 65.38, 'Q100813546', 140),
  sourcedPoi('navoiy', 'alisher-navoiy-park', 'Alisher Navoiy Park', 40.1083076, 65.3695758, 'https://yandex.com/maps/org/alisher_navoiy_national_park/95222732357/', 220),
  wikidataPoi('kosonsoy', 'mug-qala', 'Mug qala', 41.27608, 71.540155, 'Q122672687', 180),
  {
    id: 'uz:navoiy:poi:nmmc',
    type: 'poi',
    country: 'UZ',
    canonicalName: 'Navoiy Mining and Metallurgical Company',
    parentId: 'uz:navoiy',
    center: { lat: 40.101756, lng: 65.363753 },
    source: 'official',
    accuracy: 'poi',
    accuracyM: 100,
    osm: { type: 'way', id: 172452669 },
  },
]);
