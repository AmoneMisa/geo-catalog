const osmStreet = (slug, canonicalName, lat, lng, osmWayId, accuracyM = 700) => Object.freeze({
  id: `uz:nukus:street:${slug}`,
  type: 'street',
  country: 'UZ',
  canonicalName,
  parentId: 'uz:nukus',
  center: Object.freeze({ lat, lng }),
  source: 'osm',
  sourceUrl: `https://www.openstreetmap.org/way/${osmWayId}`,
  accuracy: 'street',
  accuracyM,
  osm: Object.freeze({ type: 'way', id: osmWayId }),
});

/**
 * Reviewed Nukus street candidates promoted only when the source is a direct
 * named OSM way. POIs and other node/way results from street searches remain excluded.
 */
export const NUKUS_REVIEWED_STREET_ENTITIES = Object.freeze([
  osmStreet('a-dosnazarova', 'улица А. Досназарова', 42.4971351, 59.6077641, 1059363947),
  osmStreet('a-musaeva', 'улица А. Мусаева', 42.4513232, 59.6163937, 370061754),
  osmStreet('aybek', 'улица Айбек', 42.3776235, 59.6224403, 526181005),
  osmStreet('birlikli', 'улица Бирликли', 42.5204982, 59.6090498, 367758019),
  osmStreet('dashti-kypshak', 'улица Дашти кыпшак', 42.4163033, 59.602707, 424591749),
  osmStreet('gauir-kala', 'улица Гауир кала', 42.3828884, 59.6284137, 367757307),
  osmStreet('k-ayymbetova', 'улица К. Айымбетова', 42.490603, 59.6028637, 514937629),
  osmStreet('karakalpakstan', 'улица Каракалпакстан', 42.4571499, 59.5830439, 458699310),
  osmStreet('karuan-zholy', 'улица Каруан жолы', 42.4280392, 59.5970521, 367757447),
  osmStreet('kenimekh', 'улица Кенимех', 42.4697891, 59.5778419, 367757125),
  osmStreet('kos-kol-3', 'улица Кос кол-3', 42.4366904, 59.6484891, 407679844),
  osmStreet('mazhnuntal', 'улица Мажнунтал', 42.4387961, 59.623306, 443617378),
  osmStreet('nur-ata', 'улица Нур ата', 42.4823567, 59.5540431, 444708072),
  osmStreet('oraz-akhun', 'улица Ораз Ахун', 42.4112368, 59.6289684, 429486916),
  osmStreet('sakhra-guli', 'улица Сахра гули', 42.414218, 59.6119353, 424118056),
  osmStreet('salamatlyk', 'улица Саламатлык', 42.452476, 59.6373626, 384300961),
  osmStreet('shaglasyn', 'улица Шагласын', 42.3888802, 59.61772, 443606576),
  osmStreet('tabys', 'улица Табыс', 42.4958956, 59.6031841, 367758085),
  osmStreet('temir-zhol', 'улица Темир жол', 42.4061628, 59.6141387, 1093126064),
  osmStreet('ully-zhol', 'улица Уллы жол', 42.4543359, 59.6491791, 364772982),
]);
