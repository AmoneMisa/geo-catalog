const street = (slug, canonicalName, lat, lng, accuracyM, sourceUrl) => Object.freeze({
  id: `kg:bishkek:street:${slug}`,
  type: 'street',
  country: 'KG',
  canonicalName,
  parentId: 'kg:bishkek',
  center: Object.freeze({ lat, lng }),
  source: 'manual',
  sourceUrl,
  accuracy: 'street',
  accuracyM,
});

export const KG_BISHKEK_STREET_ENTITIES = Object.freeze([
  street('chyngyz-aytmatov-avenue', 'Chyngyz Aytmatov Avenue', 42.828606, 74.583830, 4200, 'https://yandex.com/maps/10309/bishkek/house/Y00Ycw9jQUYHQFpofXRzeXpjYg%3D%3D/'),
  street('aaly-tokombayev-avenue', 'Aaly Tokombayev Avenue', 42.819978, 74.618577, 3000, 'https://yandex.com/maps/10309/bishkek/house/Y00YcAZoTEIAQFpofXRweHVkYw%3D%3D/inside/'),
  street('manas-avenue', 'Manas Avenue', 42.870770, 74.588241, 4200, 'https://yandex.com/maps/10309/bishkek/house/Y00Ycw9oS0EGQFpofXR2cXtkZA%3D%3D/'),
  street('chui-avenue', 'Chui Avenue', 42.875969, 74.592095, 5000, 'https://yandex.com/maps/10309/bishkek/house/Y00Ycw5iSUwCQFpofXR2dHVlbQ%3D%3D/'),
  street('baitik-baatyr', 'Baitik Baatyr Street', 42.850732, 74.610169, 4300, 'https://yandex.com/maps/10309/bishkek/house/Y00YcAZgSEMOQFpofXR0cXtgZg%3D%3D/'),
  street('nasirdin-isanov', 'Nasirdin Isanov Street', 42.873202, 74.591717, 2600, 'https://yandex.com/maps/10309/bishkek/house/Y00Ycw5hTkQAQFpofXR2cn5jZQ%3D%3D/'),
  street('ibraimov', 'Ibraimov Street', 42.870267, 74.616044, 3200, 'https://yandex.com/maps/10309/bishkek/house/Y00YcAZmSUEDQFpofXR2cX5lYw%3D%3D/'),
  street('toktogul', 'Toktogul Street', 42.872059, 74.602102, 4200, 'https://yandex.com/maps/10309/bishkek/house/Y00YcAdiSEUFQFpofXR2c3xmbA%3D%3D/'),
  street('joomart-bokonbayev', 'Joomart Bokonbayev Street', 42.867255, 74.591080, 4200, 'https://yandex.com/maps/10309/bishkek/house/Y00Ycw5hSU0HQFpofXR3dn5mYA%3D%3D/inside/'),
  street('jusup-abdrakhmanov', 'Jusup Abdrakhmanov Street', 42.871721, 74.611121, 3600, 'https://yandex.com/maps/10309/bishkek/house/Y00YcAZhSEcGQFpofXR2cHthZQ%3D%3D/inside/'),
]);
