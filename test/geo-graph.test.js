import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGeoRelationshipGraph, relateGeoEntities, NEIGHBOUR_DEFAULTS } from '../src/geo-graph.js';

const at = (lat, lng) => ({ lat, lng });
const entity = (id, type, parentId, center) => ({ id, type, parentId, center, canonicalName: id, country: 'UZ' });

// Tashkent-shaped fixture: a city, two districts, and the entity types the
// stage names -- mahalla, microdistrict, residential complex, street, metro, POI.
const CATALOG = [
  entity('city', 'city', null, at(41.3, 69.25)),
  entity('district-a', 'district', 'city', at(41.28, 69.2)),
  // ~2.8 km from district-a: inside the default 3 km neighbour radius.
  entity('district-b', 'district', 'city', at(41.30, 69.22)),
  entity('mahalla-a', 'mahalla', 'district-a', at(41.281, 69.201)),
  entity('micro-a', 'microdistrict', 'district-a', at(41.282, 69.202)),
  entity('rc-a', 'residential_complex', 'district-a', at(41.283, 69.203)),
  entity('metro-a', 'metro', 'city', at(41.2815, 69.2015)),
  entity('street-a', 'street', 'city', at(41.284, 69.204)),
  entity('poi-a', 'poi.market', 'city', at(41.2805, 69.2005)),
  entity('far-poi', 'poi.market', 'city', at(41.9, 69.9)),
  entity('other-city', 'city', null, at(39.65, 66.95)),
  entity('other-street', 'street', 'other-city', at(39.66, 66.96)),
];

const graph = buildGeoRelationshipGraph(CATALOG);

test('mahalla, microdistrict and residential complex all resolve to their district', () => {
  for (const id of ['mahalla-a', 'micro-a', 'rc-a']) assert.equal(graph.districtOf.get(id), 'district-a', id);
});

test('street, metro and POI all resolve to their city', () => {
  for (const id of ['street-a', 'metro-a', 'poi-a']) assert.equal(graph.cityOf.get(id), 'city', id);
});

test('an entity nested two levels deep still reaches its city', () => {
  assert.equal(graph.cityOf.get('mahalla-a'), 'city');
  assert.equal(graph.cityOf.get('rc-a'), 'city');
});

test('a city is not its own city and a district has no district', () => {
  assert.equal(graph.cityOf.get('city'), null, 'the relation means "inside", not "is"');
  assert.equal(graph.districtOf.get('district-a'), null);
});

test('an entity directly under a city has no district', () => {
  assert.equal(graph.districtOf.get('street-a'), null, 'not every entity sits in a district');
});

test('parent and child relations are both available', () => {
  assert.equal(graph.parentOf.get('mahalla-a'), 'district-a');
  assert.deepEqual([...graph.childrenOf.get('district-a')].sort(), ['mahalla-a', 'micro-a', 'rc-a']);
  assert.equal(graph.childrenOf.get('mahalla-a'), undefined);
});

test('a parent cycle resolves to null instead of hanging', () => {
  const cyclic = buildGeoRelationshipGraph([entity('a', 'mahalla', 'b', at(41, 69)), entity('b', 'mahalla', 'a', at(41, 69))]);
  assert.equal(cyclic.districtOf.get('a'), null);
  assert.equal(cyclic.cityOf.get('b'), null);
});

test('neighbours are found for the typed pairs the resolver reasons over', () => {
  assert.ok(graph.neighbours.get('metro-a')?.some((item) => item.id === 'mahalla-a'), 'metro to mahalla');
  assert.ok(graph.neighbours.get('rc-a')?.some((item) => item.id === 'metro-a'), 'residential complex to metro');
  assert.ok(graph.neighbours.get('poi-a')?.some((item) => item.id === 'district-a'), 'POI to district');
  assert.ok(graph.neighbours.get('district-a')?.some((item) => item.id === 'district-b'), 'district to district');
});

test('unrelated type pairs are not related to each other', () => {
  assert.ok(!graph.neighbours.get('street-a')?.some((item) => item.id === 'metro-a'), 'street/metro is not a pair worth storing');
});

test('entities beyond the radius are not neighbours', () => {
  assert.ok(!graph.neighbours.get('poi-a')?.some((item) => item.id === 'far-poi'));
});

test('neighbours are sorted nearest first and bounded', () => {
  const crowd = [entity('d0', 'district', null, at(41.3, 69.25))];
  for (let i = 1; i <= 20; i += 1) crowd.push(entity(`d${i}`, 'district', null, at(41.3 + i * 0.0005, 69.25)));
  const dense = buildGeoRelationshipGraph(crowd);
  const found = dense.neighbours.get('d0');
  assert.equal(found.length, NEIGHBOUR_DEFAULTS.limit, 'dense centres must not go quadratic');
  for (let i = 1; i < found.length; i += 1) assert.ok(found[i].km >= found[i - 1].km, 'nearest first');
});

test('the neighbour radius and limit are configurable', () => {
  const tight = buildGeoRelationshipGraph(CATALOG, { radiusKm: 0.01 });
  assert.ok(!tight.neighbours.get('poi-a')?.some((item) => item.id === 'district-a'));
  const capped = buildGeoRelationshipGraph(CATALOG, { limit: 1 });
  for (const found of capped.neighbours.values()) assert.ok(found.length <= 1);
});

test('neighbour computation can be skipped', () => {
  const plain = buildGeoRelationshipGraph(CATALOG, { neighbours: false });
  assert.equal(plain.neighbours.size, 0);
  assert.equal(plain.districtOf.get('mahalla-a'), 'district-a', 'containment still works');
});

test('an entity without coordinates is simply not a neighbour of anything', () => {
  const partial = buildGeoRelationshipGraph([entity('d', 'district', null, undefined), entity('e', 'district', null, at(41, 69))]);
  assert.equal(partial.neighbours.get('d'), undefined);
});

test('entities under the same parent agree', () => {
  assert.equal(relateGeoEntities(graph, 'mahalla-a', 'micro-a').relation, 'same-parent');
  assert.equal(relateGeoEntities(graph, 'mahalla-a', 'district-a').relation, 'same-parent', 'one contains the other');
});

test('entities in the same district agree more strongly than same-city ones', () => {
  const sameDistrict = relateGeoEntities(graph, 'mahalla-a', 'rc-a');
  const sameCity = relateGeoEntities(graph, 'street-a', 'metro-a');
  assert.equal(sameCity.relation, 'same-parent', 'both hang directly off the city');
  const acrossDistricts = relateGeoEntities(graph, 'mahalla-a', 'district-b');
  assert.equal(acrossDistricts.relation, 'same-city');
  assert.ok(sameDistrict.weight > acrossDistricts.weight);
});

test('entities in different cities conflict', () => {
  const conflict = relateGeoEntities(graph, 'street-a', 'other-street');
  assert.equal(conflict.relation, 'conflict');
  assert.equal(conflict.weight, 1);
});

test('proximity alone is a weak relation, not containment', () => {
  const apart = buildGeoRelationshipGraph([
    entity('m', 'metro', null, at(41.3, 69.25)),
    entity('h', 'mahalla', null, at(41.3005, 69.2505)),
  ]);
  const near = relateGeoEntities(apart, 'm', 'h');
  assert.equal(near.relation, 'neighbour');
  assert.ok(near.weight < 0.5, 'being close by is evidence, never proof');
  assert.ok(Number.isFinite(near.km));
});

test('unknown pairs report unknown rather than guessing', () => {
  assert.equal(relateGeoEntities(graph, 'street-a', 'street-a').relation, 'unknown');
  assert.equal(relateGeoEntities(graph, 'street-a', 'missing').relation, 'unknown');
  assert.equal(relateGeoEntities(graph, null, 'street-a').relation, 'unknown');
});

test('an empty catalogue builds an empty graph', () => {
  const empty = buildGeoRelationshipGraph([]);
  assert.equal(empty.parentOf.size, 0);
  assert.equal(empty.neighbours.size, 0);
});
