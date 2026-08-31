import { GEO_ENTITIES } from './catalog.js';

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

export function geoEntityKey({ country, city, type, canonical }) {
  return [country, city, type, canonical].map(normalize).join('|');
}

function entityCity(entity) {
  return entity.type === 'city' ? undefined : entity.parentId?.split(':')[1];
}

function isPoiType(type) {
  return type === 'poi' || (typeof type === 'string' && type.startsWith('poi.'));
}

const lexiconIndex = new Map();
const canonicalIndex = new Map();
const entityById = new Map(GEO_ENTITIES.map((entity) => [entity.id, entity]));
for (const entity of GEO_ENTITIES) {
  const city = entityCity(entity);
  lexiconIndex.set(geoEntityKey({
    country: entity.country,
    city,
    type: entity.type,
    canonical: entity.canonicalName,
  }), entity);

  const canonicalKey = [entity.country, city, entity.canonicalName].map(normalize).join('|');
  const canonicalMatches = canonicalIndex.get(canonicalKey) ?? [];
  canonicalMatches.push(entity);
  canonicalIndex.set(canonicalKey, canonicalMatches);

  if (entity.type === 'city') {
    lexiconIndex.set(geoEntityKey({ country: entity.country, type: 'city', canonical: entity.canonicalName }), entity);
  }
}

const alias = (country, city, type, canonical, id) => [
  geoEntityKey({ country, city, type, canonical }),
  id,
];

// Parser canonicals can evolve independently from OSM/source naming. Keep narrowly
// verified aliases here instead of duplicating physical geo entities. Listing-area
// canonicals may also resolve to an existing metro/POI/locality owner when that is
// the physical subject users actually mean.
const lexiconAliases = new Map([
  alias('UZ', 'Tashkent', 'local_area', 'TashGRES', 'uz:tashkent:local-area:tashgres'),
  alias('UZ', 'Tashkent', 'local_area', 'Takhtapul', 'uz:tashkent:local-area:taxtapul'),
  alias('UZ', 'Tashkent', 'local_area', 'Stroygorod', 'uz:tashkent:poi:stroygorod-market'),
  alias('UZ', 'Tashkent', 'local_area', 'Yangi Choshtepa', 'uz:tashkent:microdistrict:yangi-choshtepa'),

  alias('UA', 'Kharkiv', 'microdistrict', 'Saltivka', 'ua:kharkiv:microdistrict:saltivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka', 'ua:kharkiv:microdistrict:pivnichna-saltivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-1', 'ua:kharkiv:microdistrict:pivnichna-saltivka-1'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-2', 'ua:kharkiv:microdistrict:pivnichna-saltivka-2'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-3', 'ua:kharkiv:microdistrict:pivnichna-saltivka-3'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-4', 'ua:kharkiv:microdistrict:pivnichna-saltivka-4'),
  alias('UA', 'Kharkiv', 'microdistrict', 'North Saltivka-5', 'ua:kharkiv:microdistrict:pivnichna-saltivka-5'),
  alias('UA', 'Kharkiv', 'microdistrict', '524 microdistrict', 'ua:kharkiv:microdistrict:524-mikroraion'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pavlove Pole', 'ua:kharkiv:microdistrict:pavlove-pole'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Oleksiivka', 'ua:kharkiv:microdistrict:oleksiivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Shatylivka', 'ua:kharkiv:microdistrict:shatylivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Center', 'ua:kharkiv:microdistrict:nahirnyi'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zhuravlivka', 'ua:kharkiv:microdistrict:zhuravlivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Velyka Danylivka', 'ua:kharkiv:microdistrict:velyka-danylivka'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Piatykhatky', 'ua:kharkiv:microdistrict:piatykhatky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pomerky', 'ua:kharkiv:microdistrict:pomerky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Sokolnyky', 'ua:kharkiv:microdistrict:sokilnyky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Barabashovo', 'ua:kharkiv:poi:barabashovo-market'),
  alias('UA', 'Kharkiv', 'microdistrict', 'HTZ', 'ua:kharkiv:microdistrict:khtz'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Novi Budynky', 'ua:kharkiv:microdistrict:novi-budynky'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Kholodna Hora', 'ua:kharkiv:microdistrict:kholodna-hora'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zaliutyne', 'ua:kharkiv:microdistrict:zaliutyne'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Osnova', 'ua:kharkiv:microdistrict:osnova'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Levada', 'ua:kharkiv:microdistrict:levada'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Rohan', 'ua:kharkiv:microdistrict:rohan'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Horizont', 'ua:kharkiv:microdistrict:obrii'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zhykhar', 'ua:kharkiv:microdistrict:zhykhar'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zhukovskoho', 'ua:kharkiv:microdistrict:zhukovskoho'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Kulynychi', 'ua:kharkiv:microdistrict:kulynychi'),

  alias('UA', 'Kharkiv', 'microdistrict', 'Botanical Garden', 'ua:kharkiv:metro:botanichnyi-sad'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Derzhprom', 'ua:kharkiv:metro:derzhprom'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Heroiv Pratsi', 'ua:kharkiv:metro:heroiv-pratsi'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Studentska', 'ua:kharkiv:metro:studentska'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Akademika Pavlova', 'ua:kharkiv:metro:akademika-pavlova'),
  alias('UA', 'Kharkiv', 'microdistrict', '23 Serpnia', 'ua:kharkiv:metro:23-serpnia'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Pivdennyi Vokzal', 'ua:kharkiv:metro:pivdennyi-vokzal'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Haharina', 'ua:kharkiv:metro:levada'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Sportyvna', 'ua:kharkiv:metro:sportyvna'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Zakhysnykiv Ukrainy', 'ua:kharkiv:metro:zakhysnykiv-ukrainy'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Industrialna', 'ua:kharkiv:metro:industrialna'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Metalist', 'ua:kharkiv:poi:metalist'),
  alias('UA', 'Kharkiv', 'microdistrict', 'Karavan', 'ua:kharkiv:poi:karavan'),

  // The lexicon historically exposed “Rohatynskyi Kvartal” as a separate
  // residential canonical, but current project sources identify only one
  // multi-building ЖК “Rohatynskyi”. Reuse that physical owner rather than
  // inventing duplicate residential geometry.
  alias('UA', 'Kharkiv', 'residential_complex', 'Rohatynskyi Kvartal', 'ua:kharkiv:residential:rohatynskyi'),

  // Odesa listing canonicals whose verified physical owner uses a broader
  // locality type or a stable broader neighborhood. Keep the parser semantics
  // while reusing the same anchor.
  alias('UA', 'Odesa', 'microdistrict', 'Kotivskoho', 'ua:odesa:local-area:kotovskoho'),
  alias('UA', 'Odesa', 'microdistrict', 'Malyi Fontan', 'ua:odesa:local-area:malyi-fontan'),
  alias('UA', 'Odesa', 'microdistrict', 'Zastava-1', 'ua:odesa:microdistrict:zastava'),
  alias('UA', 'Odesa', 'microdistrict', 'Zastava-2', 'ua:odesa:microdistrict:zastava'),

  // Kyiv's lexicon intentionally uses stable Latin canonicals while the geo
  // records preserve Ukrainian source names. These aliases bind the two layers
  // without duplicating any physical neighborhood.
  alias('UA', 'Kyiv', 'microdistrict', 'Podil', 'ua:kyiv:microdistrict:podil'),
  alias('UA', 'Kyiv', 'microdistrict', 'Pechersk', 'ua:kyiv:microdistrict:pechersk'),
  alias('UA', 'Kyiv', 'microdistrict', 'Lipky', 'ua:kyiv:microdistrict:lypky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Zvirynets', 'ua:kyiv:microdistrict:zvirynets'),
  alias('UA', 'Kyiv', 'microdistrict', 'Chorna Hora', 'ua:kyiv:microdistrict:chorna-hora'),
  alias('UA', 'Kyiv', 'microdistrict', 'Busove Pole', 'ua:kyiv:microdistrict:busove-pole'),
  alias('UA', 'Kyiv', 'microdistrict', 'Nova Zabudova', 'ua:kyiv:microdistrict:nova-zabudova'),
  alias('UA', 'Kyiv', 'microdistrict', 'Saperne Pole', 'ua:kyiv:microdistrict:saperne-pole'),
  alias('UA', 'Kyiv', 'microdistrict', 'Center', 'ua:kyiv:microdistrict:staryi-kyiv'),
  alias('UA', 'Kyiv', 'microdistrict', 'Lukianivka', 'ua:kyiv:microdistrict:lukianivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Tatarka', 'ua:kyiv:microdistrict:tatarka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Syrets', 'ua:kyiv:microdistrict:syrets'),
  alias('UA', 'Kyiv', 'microdistrict', 'Nyvky', 'ua:kyiv:microdistrict:nyvky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Shuliavka', 'ua:kyiv:microdistrict:shuliavka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Solomianka', 'ua:kyiv:microdistrict:solomianka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Chokolivka', 'ua:kyiv:microdistrict:chokolivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Vidradnyi', 'ua:kyiv:microdistrict:vidradnyi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Karavaievi Dachi', 'ua:kyiv:microdistrict:karavaievi-dachi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Zhuliany', 'ua:kyiv:microdistrict:zhuliany'),
  alias('UA', 'Kyiv', 'microdistrict', 'Sovky', 'ua:kyiv:microdistrict:sovky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Oleksandrivska Slobidka', 'ua:kyiv:microdistrict:oleksandrivska-slobidka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Protasiv Yar', 'ua:kyiv:microdistrict:protasiv-yar'),
  alias('UA', 'Kyiv', 'microdistrict', 'Holosiiv', 'ua:kyiv:microdistrict:holosiiv'),
  alias('UA', 'Kyiv', 'microdistrict', 'Demiivka', 'ua:kyiv:microdistrict:demiivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Teremky', 'ua:kyiv:microdistrict:teremky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Teremky-1', 'ua:kyiv:microdistrict:teremky-1'),
  alias('UA', 'Kyiv', 'microdistrict', 'Teremky-2', 'ua:kyiv:microdistrict:teremky-2'),
  alias('UA', 'Kyiv', 'microdistrict', 'Feofaniia', 'ua:kyiv:microdistrict:feofaniia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Korchuvate', 'ua:kyiv:microdistrict:korchuvate'),
  alias('UA', 'Kyiv', 'microdistrict', 'Mysholovka', 'ua:kyiv:microdistrict:mysholovka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Vydubychi', 'ua:kyiv:microdistrict:vydubychi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Bahrynova Hora', 'ua:kyiv:microdistrict:bahrynova-hora'),
  alias('UA', 'Kyiv', 'microdistrict', 'Obolon', 'ua:kyiv:microdistrict:obolon'),
  alias('UA', 'Kyiv', 'microdistrict', 'Minskyi Masyv', 'ua:kyiv:microdistrict:minskyi-masyv'),
  alias('UA', 'Kyiv', 'microdistrict', 'Priorka', 'ua:kyiv:microdistrict:priorka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Kurenivka', 'ua:kyiv:microdistrict:kurenivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Vynohradar', 'ua:kyiv:microdistrict:vynohradar'),
  alias('UA', 'Kyiv', 'microdistrict', 'Vitriani Hory', 'ua:kyiv:microdistrict:vitriani-hory'),
  alias('UA', 'Kyiv', 'microdistrict', 'Pushcha-Vodytsia', 'ua:kyiv:microdistrict:pushcha-vodytsia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Troyeshchyna', 'ua:kyiv:microdistrict:troieshchyna'),
  alias('UA', 'Kyiv', 'microdistrict', 'Lisovyi Masyv', 'ua:kyiv:microdistrict:lisovyi-masyv'),
  alias('UA', 'Kyiv', 'microdistrict', 'Bykivnia', 'ua:kyiv:microdistrict:bykivnia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Voskresenka', 'ua:kyiv:microdistrict:voskresenka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Raiduzhnyi', 'ua:kyiv:microdistrict:raiduzhnyi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Mykilska Slobidka', 'ua:kyiv:microdistrict:mykilska-slobidka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Rusanivka', 'ua:kyiv:microdistrict:rusanivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Berezniaky', 'ua:kyiv:microdistrict:berezniaky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Sotsmisto', 'ua:kyiv:microdistrict:sotsmisto'),
  alias('UA', 'Kyiv', 'microdistrict', 'Darnytsia', 'ua:kyiv:microdistrict:darnytsia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Nova Darnytsia', 'ua:kyiv:microdistrict:nova-darnytsia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Stara Darnytsia', 'ua:kyiv:microdistrict:stara-darnytsia'),
  alias('UA', 'Kyiv', 'microdistrict', 'Kharkivskyi', 'ua:kyiv:microdistrict:kharkivskyi-masyv'),
  alias('UA', 'Kyiv', 'microdistrict', 'Pozniaky', 'ua:kyiv:microdistrict:pozniaky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Osokorky', 'ua:kyiv:microdistrict:osokorky'),
  alias('UA', 'Kyiv', 'microdistrict', 'Bortnychi', 'ua:kyiv:microdistrict:bortnychi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Chervonyi Khutir', 'ua:kyiv:microdistrict:chervonyi-khutir'),
  alias('UA', 'Kyiv', 'microdistrict', 'Rembaza', 'ua:kyiv:microdistrict:rembaza'),
  alias('UA', 'Kyiv', 'microdistrict', 'DVRZ', 'ua:kyiv:microdistrict:dvrz'),
  alias('UA', 'Kyiv', 'microdistrict', 'Sviatoshyn', 'ua:kyiv:microdistrict:sviatoshyn'),
  alias('UA', 'Kyiv', 'microdistrict', 'Borshchahivka', 'ua:kyiv:microdistrict:borshchahivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Pivdenna Borshchahivka', 'ua:kyiv:microdistrict:pivdenna-borshchahivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Mykilska Borshchahivka', 'ua:kyiv:microdistrict:mykilska-borshchahivka'),
  alias('UA', 'Kyiv', 'microdistrict', 'Akademmistechko', 'ua:kyiv:microdistrict:akademmistechko'),
  alias('UA', 'Kyiv', 'microdistrict', 'Bilychi', 'ua:kyiv:microdistrict:bilychi'),
  alias('UA', 'Kyiv', 'microdistrict', 'Novobilychi', 'ua:kyiv:microdistrict:novobilychi'),

  // Samarkand legacy spellings and listing-area buckets reuse verified physical
  // mahalla, station, square, boulevard and street owners instead of duplicate geometry.
  alias('UZ', 'Samarkand', 'mahalla', 'Chilkuduk', 'uz:samarkand:mahalla:chilquduq'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Sartepa', 'uz:samarkand:mahalla:sattepo'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Sat-Tepo', 'uz:samarkand:mahalla:sattepo'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Sogdiana', 'uz:samarkand:mahalla:sogdiana'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Kimyogarlar', 'uz:samarkand:settlement:kimyogarlar'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Vokzal', 'uz:samarkand:poi:samarkand-railway-station'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Universitet', 'uz:samarkand:street:university-boulevard'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Registan', 'uz:samarkand:poi:registan-square'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Dagbitskaya', 'uz:samarkand:street:dahbed'),
  alias('UZ', 'Samarkand', 'microdistrict', 'Rudaki', 'uz:samarkand:street:rudakiy'),
  alias('UZ', 'Samarkand', 'local_area', 'Sugdiyona', 'uz:samarkand:mahalla:sogdiana'),
  alias('UZ', 'Samarkand', 'local_area', 'Registon', 'uz:samarkand:poi:registan-square'),
  alias('UZ', 'Samarkand', 'local_area', 'University area', 'uz:samarkand:street:university-boulevard'),
  alias('UZ', 'Samarkand', 'local_area', 'Railway Station area', 'uz:samarkand:poi:samarkand-railway-station'),
  alias('UZ', 'Samarkand', 'local_area', 'Dahbed', 'uz:samarkand:street:dahbed'),
  alias('UZ', 'Samarkand', 'local_area', 'Rudakiy', 'uz:samarkand:street:rudakiy'),
  alias('UZ', 'Samarkand', 'local_area', 'Gagarin area', 'uz:samarkand:street:gagarin'),
  alias('UZ', 'Samarkand', 'local_area', 'Mirzo Ulugbek area', 'uz:samarkand:street:mirzo-ulugbek'),
  alias('UZ', 'Samarkand', 'local_area', 'Spitamen', 'uz:samarkand:street:spitamen'),
  alias('UZ', 'Samarkand', 'local_area', 'Panjakent Road', 'uz:samarkand:street:panjakent'),
  alias('UZ', 'Samarkand', 'local_area', "So'zangaron", 'uz:samarkand:street:sozangaron'),
  alias('UZ', 'Samarkand', 'local_area', 'Buyuk Ipak Yoli', 'uz:samarkand:street:buyuk-ipak-yuli'),
  alias('UZ', 'Samarkand', 'local_area', 'Dinamo area', 'uz:samarkand:poi:dinamo-stadium'),
]);

const compatibleTypes = Object.freeze({
  local_area: new Set(['microdistrict', 'mahalla', 'suburb', 'settlement', 'poi', 'street']),
});

function matchesCompatibleType(entityType, allowedTypes) {
  if (allowedTypes.has(entityType)) return true;
  return allowedTypes.has('poi') && isPoiType(entityType);
}

export function resolveLexiconGeoEntityExact(input) {
  if (!input?.country || !input?.canonical) return null;
  const type = input.type || 'city';
  const key = geoEntityKey({ ...input, type });
  const direct = lexiconIndex.get(key);
  if (direct) return direct;

  const aliasId = lexiconAliases.get(key);
  if (aliasId) return entityById.get(aliasId) ?? null;

  if (type === 'city') {
    return lexiconIndex.get(geoEntityKey({ country: input.country, type, canonical: input.canonical })) ?? null;
  }

  if (type === 'poi') {
    const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
    const poiMatches = (canonicalIndex.get(canonicalKey) ?? []).filter((entity) => isPoiType(entity.type));
    return poiMatches.length === 1 ? poiMatches[0] : null;
  }

  return null;
}

export function resolveLexiconGeoEntity(input) {
  const exact = resolveLexiconGeoEntityExact(input);
  if (exact) return exact;
  if (!input?.country || !input?.canonical) return null;

  const type = input.type || 'city';
  if (type === 'city' || type === 'poi') return null;

  const canonicalKey = [input.country, input.city, input.canonical].map(normalize).join('|');
  const matches = canonicalIndex.get(canonicalKey) ?? [];
  const allowedFallbackTypes = compatibleTypes[type];
  if (!allowedFallbackTypes) return null;
  const compatibleMatches = matches.filter((entity) => matchesCompatibleType(entity.type, allowedFallbackTypes));
  return compatibleMatches.length === 1 ? compatibleMatches[0] : null;
}

export function geoIdForLexiconEntity(input) {
  return resolveLexiconGeoEntity(input)?.id ?? null;
}

export function hasLexiconGeoEntity(input) {
  return resolveLexiconGeoEntity(input) !== null;
}
