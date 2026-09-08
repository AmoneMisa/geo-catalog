import test from 'node:test';
import assert from 'node:assert/strict';

import { RO_BUCHAREST_OSM_POI_ENTITIES } from '../data-source/ro/bucharest/osm-poi.js';
import { UA_KYIV_OSM_POI_ENTITIES } from '../data-source/ua/kyiv/osm-poi.js';
import { UA_KHARKIV_OSM_POI_ENTITIES } from '../data-source/ua/kharkiv/osm-poi.js';
import { UA_DNIPRO_OSM_POI_ENTITIES } from '../data-source/ua/dnipro/osm-poi.js';
import { UA_ODESA_OSM_POI_ENTITIES } from '../data-source/ua/odesa/osm-poi.js';

function assertGeneratedCityPois(entities, { country, parentId, minimum }) {
  assert.ok(entities.length >= minimum, `expected at least ${minimum} ${parentId} POIs`);
  assert.equal(new Set(entities.map((entity) => entity.id)).size, entities.length);
  assert.equal(new Set(entities.map((entity) => `${entity.osm.type}:${entity.osm.id}`)).size, entities.length);

  for (const entity of entities) {
    assert.equal(entity.country, country);
    assert.equal(entity.parentId, parentId);
    assert.match(entity.type, /^poi\./);
    assert.equal(entity.source, 'osm');
    assert.ok(Number.isFinite(entity.center.lat) && Number.isFinite(entity.center.lng));
    assert.ok(Object.values(entity.sourceNames).flat().includes(entity.canonicalName));
  }
}

test('Kyiv Geofabrik POIs remain canonical, city-scoped OSM entities', () => {
  assertGeneratedCityPois(UA_KYIV_OSM_POI_ENTITIES, {
    country: 'UA', parentId: 'ua:kyiv', minimum: 2200,
  });
  assert.ok(UA_KYIV_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.university'));
  assert.ok(UA_KYIV_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.hospital'));
});

test('Odesa Geofabrik POIs remain canonical, city-scoped OSM entities', () => {
  assertGeneratedCityPois(UA_ODESA_OSM_POI_ENTITIES, {
    country: 'UA', parentId: 'ua:odesa', minimum: 700,
  });
  assert.ok(UA_ODESA_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.railway_station'));
  assert.ok(UA_ODESA_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.hospital'));
});

test('Kharkiv Geofabrik POIs remain canonical, city-scoped OSM entities', () => {
  assertGeneratedCityPois(UA_KHARKIV_OSM_POI_ENTITIES, {
    country: 'UA', parentId: 'ua:kharkiv', minimum: 1000,
  });
  assert.ok(UA_KHARKIV_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.university'));
  assert.ok(UA_KHARKIV_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.hospital'));
});

test('Dnipro Geofabrik POIs remain canonical, city-scoped OSM entities', () => {
  assertGeneratedCityPois(UA_DNIPRO_OSM_POI_ENTITIES, {
    country: 'UA', parentId: 'ua:dnipro', minimum: 580,
  });
  assert.ok(UA_DNIPRO_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.university'));
  assert.ok(UA_DNIPRO_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.hospital'));
});

test('Bucharest Geofabrik POIs remain canonical, city-scoped OSM entities', () => {
  assertGeneratedCityPois(RO_BUCHAREST_OSM_POI_ENTITIES, {
    country: 'RO', parentId: 'ro:bucharest', minimum: 1400,
  });
  assert.ok(RO_BUCHAREST_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.airport'));
  assert.ok(RO_BUCHAREST_OSM_POI_ENTITIES.some((entity) => entity.type === 'poi.railway_station'));
});
