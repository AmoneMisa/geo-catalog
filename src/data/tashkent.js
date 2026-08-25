const district = (slug, canonicalName, lat, lng, accuracyM = 4500) => ({
  id: `uz:tashkent:${slug}`,
  type: 'district',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:tashkent',
  center: { lat, lng },
  source: 'manual',
  accuracy: 'approximate',
  accuracyM,
});

export const TASHKENT_ENTITIES = Object.freeze([
  // Administrative district centroids. These are intentionally marked approximate:
  // exact boundaries belong in bbox/polygon data once verified against OSM/official GIS.
  district('almazar','Almazar',41.3483,69.2052),
  district('bektemir','Bektemir',41.2093,69.3341),
  district('mirobod','Mirobod',41.2914,69.2898),
  district('mirzo-ulugbek','Mirzo Ulugbek',41.3263,69.3367),
  district('sergeli','Sergeli',41.2262,69.2192),
  district('uchtepa','Uchtepa',41.2923,69.1794),
  district('chilanzar','Chilanzar',41.2732,69.2036),
  district('shaykhantahur','Shaykhantahur',41.3224,69.2414),
  district('yunusabad','Yunusabad',41.3653,69.2887),
  district('yakkasaray','Yakkasaray',41.2771,69.2531),
  district('yangihayot','Yangihayot',41.2180,69.1960),
  district('yashnobod','Yashnobod',41.2960,69.3320),
]);
