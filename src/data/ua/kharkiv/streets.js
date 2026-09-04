const street = (slug, canonicalName, lat, lng, accuracyM, extra = {}) => Object.freeze({
  id: `ua:kharkiv:street:${slug}`,
  type: 'street',
  country: 'UA',
  canonicalName,
  parentId: 'ua:kharkiv',
  center: Object.freeze({ lat, lng }),
  source: extra.osm ? 'osm' : extra.wikidataId ? 'wikidata' : extra.source ?? 'manual',
  accuracy: 'street',
  accuracyM,
  ...extra,
});

const yandexStreet = (slug, canonicalName, lat, lng, queryName, accuracyM = 3200) => street(
  slug,
  canonicalName,
  lat,
  lng,
  accuracyM,
  {
    source: 'manual',
    sourceUrl: `https://yandex.com/maps/?text=${encodeURIComponent(`${queryName}, Kharkiv`)}`,
  },
);

export const UA_KHARKIV_STREET_ENTITIES = Object.freeze([
  street('sumska', 'Sumska Street', 50.012008, 36.242666, 2200, {
    wikidataId: 'Q4446038',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4446038',
  }),
  street('nauky-avenue', 'Nauky Avenue', 50.016667, 36.216667, 2600, {
    source: 'manual',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Nauky_Avenue,_Kharkiv',
  }),
  street('heroiv-kharkova-avenue', 'Heroiv Kharkova Avenue', 49.989444, 36.247222, 5000, {
    osm: Object.freeze({ type: 'relation', id: 1295889 }),
    wikidataId: 'Q4304257',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Heroiv_Kharkova_Avenue,_Kharkiv',
  }),
  street('saltivske-highway', 'Saltivske Highway', 49.988204, 36.339941, 5000, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/i/STR3KEVMFW6K',
    bbox: Object.freeze({ south: 49.986107, west: 36.285442, north: 49.999420, east: 36.382199 }),
  }),
  street('poltavskyi-shliakh', 'Poltavskyi Shliakh Street', 49.988500, 36.226470, 4200, {
    osm: Object.freeze({ type: 'relation', id: 2392273 }),
    wikidataId: 'Q4370811',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Poltavskyi_Shliakh_Street,_Kharkiv',
  }),
  street('klochkivska', 'Klochkivska Street', 49.990530, 36.227620, 4200, {
    osm: Object.freeze({ type: 'relation', id: 1419947 }),
    wikidataId: 'Q4224156',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Klochkivska_Street,_Kharkiv',
  }),
  street('hvardiitsiv-shyronintsiv', 'Hvardiitsiv-Shyronintsiv Street', 50.013056, 36.346944, 3600, {
    osm: Object.freeze({ type: 'relation', id: 1324398 }),
    wikidataId: 'Q20074979',
    sourceUrl: 'https://www.wikidata.org/wiki/Q20074979',
  }),
  street('yuvileinyi-avenue', 'Yuvileinyi Avenue', 49.996528, 36.334506, 3200, {
    osm: Object.freeze({ type: 'relation', id: 1544670 }),
    wikidataId: 'Q20091992',
    sourceUrl: 'https://www.wikidata.org/wiki/Q20091992',
  }),
  street('traktorobudivnykiv-avenue', 'Traktorobudivnykiv Avenue', 50.000000, 36.340833, 4700, {
    osm: Object.freeze({ type: 'relation', id: 1386634 }),
    wikidataId: 'Q95985900',
    sourceUrl: 'https://www.wikidata.org/wiki/Q95985900',
  }),
  street('lva-landau-avenue', 'Lva Landau Avenue', 49.939167, 36.294444, 5000, {
    osm: Object.freeze({ type: 'relation', id: 1570082 }),
    wikidataId: 'Q4381037',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4381037',
  }),
  street('aerokosmichnyi-avenue', 'Aerokosmichnyi Avenue', 49.926405, 36.272535, 6500, {
    osm: Object.freeze({ type: 'relation', id: 1703731 }),
    wikidataId: 'Q4381105',
    sourceUrl: 'https://www.wikidata.org/wiki/Q4381105',
    bbox: Object.freeze({ south: 49.868320, west: 36.245120, north: 49.984490, east: 36.299950 }),
  }),
  street('amosova', 'Amosova Street', 49.982357, 36.348972, 2800, {
    source: 'manual',
    sourceUrl: 'https://tv.yandex.com/maps/147/kharkiv/house/vulytsia_amosova_26a/Z08YdQNoQEIFQFpjfXV5c39mYg%3D%3D/',
  }),
  street('valentynivska', 'Valentynivska Street', 50.022250, 36.318028, 4100, {
    osm: Object.freeze({ type: 'relation', id: 2045337 }),
    wikidataId: 'Q97306304',
    sourceUrl: 'https://www.wikidata.org/wiki/Q97306304',
  }),
  street('sobornosti-ukrainy', 'Sobornosti Ukrainy Street', 50.03373904037319, 36.3589230525349, 1700, {
    source: 'manual',
    sourceUrl: 'https://maps.visicom.ua/c/36.35777%2C50.03417%2C14/f/STR3KEVMFVHQ?lang=uk',
    bbox: Object.freeze({ south: 50.031605747785, west: 36.34591904048198, north: 50.03674003079843, east: 36.36962288588404 }),
  }),
  yandexStreet('natalii-uzhvii', 'Natalii Uzhvii Street', 50.044566, 36.352739, 'вулиця Наталії Ужвій', 3000),
  yandexStreet('lesia-serdiuka', 'Lesia Serdiuka Street', 50.0407725, 36.3498935, 'вулиця Леся Сердюка', 3400),
  yandexStreet('vladyslava-zubenka', 'Vladyslava Zubenka Street', 50.0028465, 36.3460155, 'вулиця Владислава Зубенка', 3200),
  yandexStreet('vasylia-stusa', 'Vasylia Stusa Street', 49.999920, 36.340367, 'вулиця Василя Стуса', 3000),
  yandexStreet('romashova', 'Romashova Street', 50.033565, 36.343283, 'вулиця Ромашова', 2800),
  yandexStreet('poznanska', 'Poznanska Street', 50.0216325, 36.3425855, 'вулиця Познанська', 3000),
  street('buchmy', 'Buchmy Street', 50.027663, 36.3536005, 3300, {
    source: 'manual',
    sourceUrl: 'https://reestr.kharkiv.rocks/644875',
  }),
  street('tarasa-redkina', 'Tarasa Redkina Street', 50.013124, 36.325231, 2500, {
    source: 'manual',
    sourceUrl: 'https://city.kharkiv.ua/documents/gromadski-sluxannia/perelik-pereimenuvan-objektiv-toponimiki-mxarkova',
  }),
  yandexStreet('haribaldi', 'Haribaldi Street', 50.007744, 36.357285, 'вулиця Гарібальді', 2200),
  yandexStreet('drahomanova', 'Drahomanova Street', 49.991206, 36.362643, 'вулиця Драгоманова', 3000),
  street('neskorenykh', 'Neskorenykh Street', 50.0211675, 36.348017, 5200, {
    source: 'manual',
    sourceUrl: 'https://kharkivoda.gov.ua/news/127625',
  }),
  yandexStreet('svitla', 'Svitla Street', 50.016500, 36.366509, 'вулиця Світла', 3000),
  yandexStreet('ruslana-plokhodka', 'Ruslana Plokhodka Street', 49.989945, 36.351499, 'вулиця Руслана Плоходька', 3000),
  street('yany-chervonoi', 'Yany Chervonoi Street', 50.031483, 36.3569425, 2600, {
    source: 'manual',
    sourceUrl: 'https://ukrpohliad.org/national-memory/u-harkovi-perejmenuvaly-367-toponimiv-novi-nazvy-vulycz.html',
  }),
]);
