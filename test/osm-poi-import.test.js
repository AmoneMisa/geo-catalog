import test from 'node:test';
import assert from 'node:assert/strict';
import { extractOsmPoiCandidates, filterCachedOsmPoiFeatures, foldMixedScriptConfusables, mergeOsmPoiCandidates } from '../src/osm-poi-import.js';

const feature = (osmType, osmId, tags) => ({ properties: { osm_type: osmType, osm_id: osmId, tags }, geometry: { type: 'Point', coordinates: [69.2, 41.3] } });

test('normalizes valid OSM POI tag variants into explicit catalog types', () => {
  const candidates = extractOsmPoiCandidates([
    feature('way', 1, { name: 'Sample College', amenity: 'college', 'name:ru': 'Примерный колледж' }),
    feature('node', 2, { name: 'Central Parking', amenity: 'parking', parking: 'multi-storey' }),
    feature('relation', 3, { name: 'Airport Terminal A', aeroway: 'terminal' }),
  ], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  assert.deepEqual(candidates.map((item) => item.type).sort(), ['poi.airport_terminal', 'poi.college', 'poi.parking_structure']);
  assert.deepEqual(candidates.find((item) => item.type === 'poi.college').sourceNames.ru, ['Примерный колледж']);
});

test('trims source name whitespace before creating a canonical POI identity', () => {
  const [candidate] = extractOsmPoiCandidates([
    feature('node', 9, { name: '  Example Clinic  ', amenity: 'clinic' }),
  ], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  assert.equal(candidate.canonicalName, 'Example Clinic');
  assert.equal(candidate.sourceNames.canonical[0], 'Example Clinic');
  assert.match(candidate.id, /example-clinic/);
});

test('merges node and polygon representations while preserving reviewed entries', () => {
  const [node] = extractOsmPoiCandidates([feature('node', 1, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const [way] = extractOsmPoiCandidates([feature('way', 2, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const merged = mergeOsmPoiCandidates([node, way]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].concordances.osm.length, 2);
  const manual = { ...node, source: 'manual', canonicalName: 'Reviewed Hospital' };
  assert.equal(mergeOsmPoiCandidates([way], [manual])[0].canonicalName, 'Reviewed Hospital');
});

test('does not mutate an existing catalog record while building a refresh result', () => {
  const [node] = extractOsmPoiCandidates([feature('node', 1, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const [way] = extractOsmPoiCandidates([feature('way', 2, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const reviewed = { ...node };
  const merged = mergeOsmPoiCandidates([way], [reviewed]);
  assert.equal(reviewed.concordances.osm.length, 1);
  assert.equal(merged[0].concordances.osm.length, 2);
});

test('keeps one canonical candidate for repeated source features with the same city/type/name', () => {
  const candidates = extractOsmPoiCandidates([
    feature('node', 1, { name: 'School 42', amenity: 'school' }),
    feature('way', 2, { name: 'School 42', amenity: 'school' }),
  ], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const merged = mergeOsmPoiCandidates(candidates);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].osm.type, 'way');
});

test('map-poi cache profile keeps named transport and usable parking while removing map noise', () => {
  const filtered = filterCachedOsmPoiFeatures([
    feature('node', 1, { name: 'Central Bus Station', amenity: 'bus_station' }),
    feature('node', 2, { name: 'Metro Stop', railway: 'station', station: 'subway' }),
    feature('way', 3, { name: 'Parking', amenity: 'parking' }),
    feature('way', 4, { name: 'Mall Parking', amenity: 'parking' }),
    feature('way', 5, { name: 'Staff Parking', amenity: 'parking', access: 'private' }),
    feature('node', 6, { name: 'Central Station', railway: 'station' }),
  ], { profile: 'map-poi' });
  assert.deepEqual(filtered.map((item) => item.properties.osm_id), [1, 4, 6]);
});

test('a Wikidata match folds an OSM candidate into a reviewed entity of another type', () => {
  // Tashkent metro stations are reviewed as `metro`; OSM tags the same physical
  // station as `railway_station`. Matching on type alone produced a second
  // entity for the same Wikidata item.
  const reviewed = [{
    id: 'uz:tashkent:metro:chilonzor',
    type: 'metro',
    country: 'UZ',
    parentId: 'uz:tashkent',
    canonicalName: 'Chilonzor',
    wikidataId: 'Q4515926',
    source: 'wikidata',
  }];
  const candidates = extractOsmPoiCandidates([
    feature('node', 854338154, { name: 'Chilonzor', railway: 'station', station: 'subway', wikidata: 'Q4515926' }),
  ], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const merged = mergeOsmPoiCandidates(candidates, reviewed);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].id, 'uz:tashkent:metro:chilonzor');
  assert.deepEqual(merged[0].concordances.osm, [{ type: 'node', id: 854338154 }]);
});

test('imported names collapse whitespace and fold mixed-script confusables', () => {
  const [candidate] = extractOsmPoiCandidates([
    feature('node', 7, { name: 'Tinchlik  kо‘chasi maktabi ', amenity: 'school' }),
  ], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  assert.equal(candidate.canonicalName, "Tinchlik ko‘chasi maktabi");

  // A word whose letters all have lookalikes takes the script of the name.
  assert.equal(foldMixedScriptConfusables('Аxsi 18-berk koʼchasi'), 'Axsi 18-berk koʼchasi');
  // Genuinely bilingual names are left alone.
  assert.equal(foldMixedScriptConfusables('ЖК Jazz Квартал'), 'ЖК Jazz Квартал');
  assert.equal(foldMixedScriptConfusables('Москва'), 'Москва');
});

test('confusable folding does not create a second entity for one place', () => {
  // The second name ends in a Latin "a"; before folding the two produced
  // separate canonical entities that broke the semantic uniqueness invariant.
  const candidates = extractOsmPoiCandidates([
    feature('way', 439543238, { name: 'Пахта куча', amenity: 'marketplace' }),
    feature('way', 71455233, { name: 'Пахта кучa', amenity: 'marketplace' }),
  ], { country: 'KG', city: 'Osh', parentId: 'kg:osh' });
  const merged = mergeOsmPoiCandidates(candidates);
  assert.equal(merged.length, 1);
});
