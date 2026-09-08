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

function normalize(value) {
  return String(value ?? '').normalize('NFKC').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
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
    names[language] = [...new Set(String(value).split(';').map((item) => item.trim()).filter(Boolean))];
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
    const tags = feature?.properties?.tags || feature?.properties || {};
    const type = TAG_RULES.find(([, matches]) => matches(tags))?.[0];
    const center = pointFromGeometry(feature?.geometry);
    const canonicalName = tags.name || tags['name:en'] || tags.official_name;
    const osmType = feature?.properties?.osm_type || feature?.properties?.type;
    const osmId = Number(feature?.properties?.osm_id || feature?.properties?.id);
    if (!type || !center || !canonicalName || !['node', 'way', 'relation'].includes(osmType) || !Number.isInteger(osmId)) continue;
    candidates.push({
      id: `${country.toLowerCase()}:${normalize(city)}:poi:${normalize(canonicalName)}-${osmType[0]}${osmId}`,
      type, country: country.toUpperCase(), canonicalName, parentId, center,
      source: 'osm', accuracy: 'poi', osm: { type: osmType, id: osmId },
      concordances: { osm: [{ type: osmType, id: osmId }], ...(tags.wikidata ? { wikidata: tags.wikidata } : {}) },
      ...(tags.wikidata ? { wikidataId: tags.wikidata } : {}),
      ...(Object.keys(sourceNames(tags)).length ? { sourceNames: sourceNames(tags) } : {}),
    });
  }
  return candidates.sort((a, b) => a.id.localeCompare(b.id));
}

/** Preserves reviewed records and folds OSM node/way/relation duplicates into one logical POI. */
export function mergeOsmPoiCandidates(candidates, reviewed = []) {
  const result = [...reviewed];
  for (const candidate of candidates) {
    const existing = result.find((entity) => entity.country === candidate.country && entity.parentId === candidate.parentId
      && entity.type === candidate.type && ((candidate.wikidataId && entity.wikidataId === candidate.wikidataId)
        || (normalize(entity.canonicalName) === normalize(candidate.canonicalName) && distanceMeters(entity.center, candidate.center) <= 250)));
    if (existing) {
      if (existing.source === 'manual') continue;
      const osm = [...new Map([...(existing.concordances?.osm || existing.osm ? [existing.osm] : []), ...(candidate.concordances.osm || [])].filter(Boolean).map((item) => [`${item.type}:${item.id}`, item])).values()];
      existing.concordances = { ...(existing.concordances || {}), osm };
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
