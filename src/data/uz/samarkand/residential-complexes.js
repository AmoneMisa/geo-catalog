const residential = (slug, canonicalName, lat, lng, sourceUrl, accuracyM = 500) => Object.freeze({
  id: `uz:samarkand:residential:${slug}`,
  type: 'residential_complex',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:samarkand',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  accuracy: 'building',
  accuracyM,
  sourceUrl,
});

export const SAMARKAND_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('samarkand-city', 'Samarkand City', 39.647175, 66.943030, 'https://yandex.com/maps/10334/samarkand/geo/4220993069/', 700),
  residential('afrosiyob-residence', 'Afrosiyob Residence', 39.686444, 66.937340, 'https://yandex.com/maps/org/afrosiyob_residence/27069987061/', 220),
  residential('shahriston-by-txt-group', 'Shahriston by TXT Group', 39.689240, 66.922950, 'https://yandex.com/maps/org/shahriston_by_txt_group/48729400489/', 220),
  residential('bagishamal-city', 'Bagishamal City', 39.669819, 66.927830, 'https://yandex.com/maps/org/bagishamal_city/206916357835/', 260),
  residential('asia-town', 'Asia Town', 39.647433, 66.993636, 'https://yandex.com/maps/org/asia_town/49332602163/', 220),
  residential('bunyodkor', 'Bunyodkor', 39.628687, 66.956918, 'https://yandex.com/maps/org/bunyodkor/13727982928/', 220),
]);
