const residential = (slug, canonicalName, lat, lng, sourceUrl) => Object.freeze({
  id: `ua:odesa:residential-complex:${slug}`,
  type: 'residential_complex',
  country: 'UA',
  canonicalName,
  parentId: 'ua:odesa',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'building',
  accuracyM: 280,
});

const YANDEX_ODESA_RESIDENTIAL_SEARCH = 'https://yandex.com/maps/?text=%D0%96%D0%9A%2C%20Odesa';

/**
 * Strong page-scrape anchors that are inside Odesa proper. Results whose
 * addresses resolve to Kryzhanivka, Fontanka or Limanka stay out of this city
 * collection and are not force-parented to Odesa.
 */
export const UA_ODESA_CLEANED_RESIDENTIAL_COMPLEX_ENTITIES = Object.freeze([
  residential('arc-palace', 'Arc Palace', 46.438772, 30.758746, YANDEX_ODESA_RESIDENTIAL_SEARCH),
  residential('synia-ptakh', 'Synia Ptakh', 46.47375, 30.759286, YANDEX_ODESA_RESIDENTIAL_SEARCH),
  residential('favorit', 'Favorit', 46.447069, 30.734267, YANDEX_ODESA_RESIDENTIAL_SEARCH),
  residential('club-marine', 'Club Marine', 46.368985, 30.726713, YANDEX_ODESA_RESIDENTIAL_SEARCH),
  residential('7-pearl', '7 Pearl', 46.436976, 30.766204, YANDEX_ODESA_RESIDENTIAL_SEARCH),
  residential('8-pearl', '8 Pearl', 46.437747, 30.765668, YANDEX_ODESA_RESIDENTIAL_SEARCH),
]);
