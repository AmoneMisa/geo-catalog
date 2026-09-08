import test from 'node:test';
import assert from 'node:assert/strict';
import { extractOsmPoiCandidates, mergeOsmPoiCandidates } from '../src/osm-poi-import.js';

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

test('merges node and polygon representations while preserving reviewed entries', () => {
  const [node] = extractOsmPoiCandidates([feature('node', 1, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const [way] = extractOsmPoiCandidates([feature('way', 2, { name: 'Example Hospital', amenity: 'hospital', wikidata: 'Q1' })], { country: 'UZ', city: 'Tashkent', parentId: 'uz:tashkent' });
  const merged = mergeOsmPoiCandidates([node, way]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].concordances.osm.length, 2);
  const manual = { ...node, source: 'manual', canonicalName: 'Reviewed Hospital' };
  assert.equal(mergeOsmPoiCandidates([way], [manual])[0].canonicalName, 'Reviewed Hospital');
});
