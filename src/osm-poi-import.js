import { geoPoiCategory } from './poi-taxonomy.js';

const TAG_RULES = Object.freeze([
  ['poi.university', (t) => t.amenity === 'university'],
  ['poi.college', (t) => t.amenity === 'college'],
  ['poi.school', (t) => t.amenity === 'school'],
  ['poi.kindergarten', (t) => t.amenity === 'kindergarten' || t.education === 'kindergarten'],
  ['poi.hospital', (t) => t.amenity === 'hospital' || t.healthcare === 'hospital'],
  ['poi.clinic', (t) => t.amenity === 'clinic' || t.healthcare === 'clinic'],
  ['poi.medical_center', (t) => ['doctors', 'centre'].includes(t.healthcare) || /medical\s+cent/i.test(t.name || '')],
  ['poi.airport_terminal', (t) => t.aeroway === 'terminal'],
  ['poi.airport', (t) => t.aeroway === 'aerodrome'],
  ['poi.railway_station', (t) => t.railway === 'station' || t.public_transport === 'station' && t.station === 'train'],
  ['poi.railway_halt', (t) => t.railway === 'halt'],
  ['poi.bus_station', (t) => t.amenity === 'bus_station'],
  ['poi.transport_hub', (t) => t.public_transport === 'station' || t.public_transport === 'stop_area'],
  ['poi.park_and_ride', (t) => t.park_ride === 'yes'],
  ['poi.parking_structure', (t) => t.amenity === 'parking' && ['multi-storey', 'underground'].includes(t.parking)],
  ['poi.parking', (t) => t.amenity === 'parking' || t.amenity === 'parking_entrance'],
  ['poi.shopping_mall', (t) => t.shop === 'mall' || t.amenity === 'shopping_centre'],
  ['poi.market', (t) => t.amenity === 'marketplace'],
  ['poi.park', (t) => t.leisure === 'park'],
]);

const MAP_POI_TYPES = new Set([
  'poi.airport', 'poi.airport_terminal', 'poi.railway_station', 'poi.railway_halt',
  'poi.bus_station', 'poi.park_and_ride', 'poi.parking_structure', 'poi.parking',
]);

const GENERIC_PARKING_NAMES = new Set([
  'parking', 'парковка', 'автостоянка', 'стоянка', 'car park', 'car parking',
  'avtoturargoh', 'avtostoyanka',
]);

function normalize(value) {
  return foldMixedScriptConfusables(String(value ?? '')).normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

function tagsFor(feature) {
  return feature?.properties?.tags || feature?.properties || {};
}

// OSM names occasionally mix visually identical Latin/Cyrillic letters inside
// one word (e.g. Cyrillic "о" in Uzbek Latin "kо‘chasi"), which breaks exact
// catalog-name lookups. A word is folded toward the only script that has
// unambiguous letters in it; genuinely mixed or undecidable words are kept.
const CYRILLIC_TO_LATIN_CONFUSABLES = Object.freeze({
  а: 'a', е: 'e', о: 'o', р: 'p', с: 'c', у: 'y', х: 'x', і: 'i', ј: 'j', ѕ: 's',
  к: 'k', м: 'm', т: 't',
  А: 'A', В: 'B', Е: 'E', К: 'K', М: 'M', Н: 'H', О: 'O', Р: 'P', С: 'C', Т: 'T', Х: 'X', І: 'I', Ј: 'J', Ѕ: 'S',
});
const LATIN_TO_CYRILLIC_CONFUSABLES = Object.freeze(Object.fromEntries(
  Object.entries(CYRILLIC_TO_LATIN_CONFUSABLES).map(([cyrillic, latin]) => [latin, cyrillic]),
));
const LATIN_LETTER_RE = /\p{Script=Latin}/u;
const CYRILLIC_LETTER_RE = /\p{Script=Cyrillic}/u;
// Apostrophe-like marks belong to the word (Uzbek "koʻchasi"), so they must not
// split a token and hide the letters that identify its script.
const WORD_RE = /[\p{L}\u0027\u02BB\u02BC\u2018\u2019\u201B\u2032\u00B4`]+/gu;

function scriptOf(word) {
  let latin = false;
  let cyrillic = false;
  for (const char of word) {
    if (LATIN_LETTER_RE.test(char) && !(char in LATIN_TO_CYRILLIC_CONFUSABLES)) latin = true;
    else if (CYRILLIC_LETTER_RE.test(char) && !(char in CYRILLIC_TO_LATIN_CONFUSABLES)) cyrillic = true;
  }
  if (latin === cyrillic) return null;
  return latin ? 'latin' : 'cyrillic';
}

export function foldMixedScriptConfusables(value) {
  const text = String(value ?? '');
  // A word with no unambiguous letter of its own (every letter has a lookalike
  // in the other script) inherits the script of the surrounding name, but only
  // when the name itself is unambiguous. Genuinely bilingual names are left
  // alone rather than forced into one script.
  const scripts = new Set([...text.matchAll(WORD_RE)].map(([word]) => scriptOf(word)).filter(Boolean));
  const nameScript = scripts.size === 1 ? [...scripts][0] : null;
  return text.replace(WORD_RE, (word) => {
    const script = scriptOf(word) ?? nameScript;
    if (!script) return word;
    const map = script === 'latin' ? CYRILLIC_TO_LATIN_CONFUSABLES : LATIN_TO_CYRILLIC_CONFUSABLES;
    return [...word].map((char) => map[char] ?? char).join('');
  });
}

function sourceName(tags) {
  return foldMixedScriptConfusables(String(tags.name || tags['name:en'] || tags.official_name || '').replace(/\s+/gu, ' ').trim());
}

/**
 * Narrows raw cached OSM extracts to map-useful, named POIs before review.
 * It deliberately does not approve or import anything: the caller still
 * receives a normal review artifact and must inspect it before generation.
 */
export function filterCachedOsmPoiFeatures(features, { profile = 'all' } = {}) {
  if (!Array.isArray(features)) return [];
  if (profile === 'all') return [...features];
  if (profile !== 'map-poi') throw new Error(`Unsupported cached OSM profile: ${profile}`);

  return features.filter((feature) => {
    const tags = tagsFor(feature);
    const type = TAG_RULES.find(([, matches]) => matches(tags))?.[0];
    const name = sourceName(tags);
    if (!MAP_POI_TYPES.has(type) || !name) return false;

    // Metro/light-rail stations have dedicated city transport modules. They
    // are not railway-station candidates for this cache-cleaning workflow.
    if (type === 'poi.railway_station' && ['subway', 'light_rail'].includes(tags.station)) return false;
    // Private and generic parking areas create map noise without a usable
    // destination identity. Named public/special-purpose parking remains.
    if (['poi.parking', 'poi.parking_structure'].includes(type)
      && (tags.access === 'private' || GENERIC_PARKING_NAMES.has(normalize(name)))) return false;
    return true;
  });
}

function pointFromGeometry(geometry) {
  if (geometry?.type === 'Point' && Array.isArray(geometry.coordinates)) {
    const [lng, lat] = geometry.coordinates;
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }
  const positions = [];
  const collect = (value) => {
    if (!Array.isArray(value)) return;
    if (value.length >= 2 && Number.isFinite(value[0]) && Number.isFinite(value[1])) positions.push(value);
    else value.forEach(collect);
  };
  collect(geometry?.coordinates);
  if (!positions.length) return null;
  const [lng, lat] = positions.reduce(([x, y], [nextX, nextY]) => [x + nextX, y + nextY], [0, 0]);
  return { lat: lat / positions.length, lng: lng / positions.length };
}

function sourceNames(tags) {
  const names = {};
  for (const [key, value] of Object.entries(tags)) {
    if (!value || !(key === 'name' || key.startsWith('name:') || ['alt_name', 'old_name', 'short_name', 'official_name', 'loc_name'].includes(key))) continue;
    const language = key === 'name' ? 'canonical' : key.slice(5) || key;
    names[language] = [...new Set(String(value).split(';').map((item) => foldMixedScriptConfusables(item.replace(/\s+/gu, ' ').trim())).filter(Boolean))];
  }
  return names;
}

function distanceMeters(a, b) {
  const lat = (a.lat + b.lat) / 2 * Math.PI / 180;
  return Math.hypot((a.lat - b.lat) * 111_320, (a.lng - b.lng) * 111_320 * Math.cos(lat));
}

/** Converts already-downloaded OSM GeoJSON into deterministic catalog candidates. */
export function extractOsmPoiCandidates(features, { country, city, parentId } = {}) {
  if (!country || !city || !parentId || !Array.isArray(features)) return [];
  const candidates = [];
  for (const feature of features) {
    const tags = tagsFor(feature);
    const type = TAG_RULES.find(([, matches]) => matches(tags))?.[0];
    const center = pointFromGeometry(feature?.geometry);
    const canonicalName = sourceName(tags);
    const osmType = feature?.properties?.osm_type || feature?.properties?.type;
    const osmId = Number(feature?.properties?.osm_id || feature?.properties?.id);
    if (!type || !center || !canonicalName || !['node', 'way', 'relation'].includes(osmType) || !Number.isInteger(osmId)) continue;
    candidates.push({
      id: `${country.toLowerCase()}:${normalize(city)}:poi:${normalize(canonicalName)}-${osmType[0]}${osmId}`,
      type, country: country.toUpperCase(), canonicalName, parentId, center,
      source: 'osm', accuracy: 'poi',
      // Points are mapped positions; a polygon/way center is a representative
      // centroid and should be described less precisely.
      accuracyM: osmType === 'node' ? 30 : osmType === 'way' ? 150 : 300,
      osm: { type: osmType, id: osmId },
      concordances: { osm: [{ type: osmType, id: osmId }], ...(tags.wikidata ? { wikidata: tags.wikidata } : {}) },
      ...(tags.wikidata ? { wikidataId: tags.wikidata } : {}),
      ...(Object.keys(sourceNames(tags)).length ? { sourceNames: sourceNames(tags) } : {}),
    });
  }
  const geometryRank = { way: 0, relation: 1, node: 2 };
  return candidates.sort((a, b) => normalize(a.canonicalName).localeCompare(normalize(b.canonicalName))
    || a.type.localeCompare(b.type)
    || geometryRank[a.osm.type] - geometryRank[b.osm.type]
    || a.osm.id - b.osm.id);
}

/** Preserves reviewed records and folds OSM node/way/relation duplicates into one logical POI. */
export function mergeOsmPoiCandidates(candidates, reviewed = []) {
  // Import refreshes must never mutate the reviewed catalog objects supplied by
  // callers. The generated module decides whether to accept an enrichment.
  const result = [...reviewed];
  for (const candidate of candidates) {
    const existingIndex = result.findIndex((entity) => entity.country === candidate.country && entity.parentId === candidate.parentId
      // A Wikidata item identifies one physical object regardless of how the
      // catalog types it (e.g. a reviewed `metro` station vs an OSM
      // `railway_station` candidate), so it matches across types.
      && ((candidate.wikidataId && entity.wikidataId === candidate.wikidataId)
        // The catalog intentionally has a semantic uniqueness invariant. An
        // unreviewed second feature with the same city/type/name therefore
        // enriches the first candidate instead of creating an invalid duplicate.
        || (entity.type === candidate.type && normalize(entity.canonicalName) === normalize(candidate.canonicalName))));
    const existing = existingIndex >= 0 ? result[existingIndex] : null;
    if (existing) {
      if (existing.source === 'manual') continue;
      const existingOsm = existing.concordances?.osm || (existing.osm ? [existing.osm] : []);
      const osm = [...new Map([...existingOsm, ...(candidate.concordances.osm || [])].filter(Boolean).map((item) => [`${item.type}:${item.id}`, item])).values()];
      result[existingIndex] = { ...existing, concordances: { ...(existing.concordances || {}), osm } };
      continue;
    }
    result.push(candidate);
  }
  return result;
}

export function osmPoiCategory(feature) {
  const tags = feature?.properties?.tags || feature?.properties || {};
  const type = TAG_RULES.find(([, matches]) => matches(tags))?.[0];
  return geoPoiCategory(type);
}
