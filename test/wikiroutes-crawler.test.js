import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseCatalogRoutes,
  parseRoutePage,
  parseStopPage,
  reconcileStopsWithOsm,
} from '../scripts/refresh-tashkent-bus-wikiroutes.js';

test('catalog parser takes every bus route link and ignores later route sections', () => {
  const html = `
    <h2>Автобусы (2)</h2>
    <a href="/tashkent?routes=10600">1</a>
    <a href="/tashkent?routes=10601">101 (Ташкент - Дархан)</a>
    <h2>Маршрутки (1)</h2>
    <a href="/tashkent?routes=20000">1м</a>`;
  assert.deepEqual(parseCatalogRoutes(html).map(({ sourceRouteId, ref }) => [sourceRouteId, ref]), [
    ['10600', '1'],
    ['10601', '101'],
  ]);
});

test('route parser preserves both direction stop orders', () => {
  const route = { sourceRouteUrl: 'https://ru.wikiroutes.info/tashkent?routes=10600', ref: '1' };
  const html = `
    <h2>A — B</h2>
    <h3><a href="/stops/10">A</a></h3><h3><a href="/stops/11">Middle</a></h3><h3><a href="/stops/12">B</a></h3>
    <h2>B — A</h2>
    <h3><a href="/stops/12">B</a></h3><h3><a href="/stops/13">Other</a></h3><h3><a href="/stops/10">A</a></h3>`;
  const parsed = parseRoutePage(html, route);
  assert.deepEqual(parsed.directions.map((direction) => direction.stops.map((stop) => stop.sourceStopId)), [
    ['10', '11', '12'],
    ['12', '13', '10'],
  ]);
});

test('stop parser extracts Tashkent coordinates and rejects unrelated coordinates', () => {
  const stop = { sourceStopId: '10', name: 'A' };
  assert.deepEqual(parseStopPage('<script>{"lat":41.311,"lng":69.279}</script>', stop), {
    ...stop, lat: 41.311, lng: 69.279, coordinateStatus: 'ok',
  });
  assert.equal(parseStopPage('<script>{"lat":55.75,"lng":37.61}</script>', stop).coordinateStatus, 'missing');
});

test('reconciliation prefers same-name nearby OSM stop and does not force ambiguous distant matches', () => {
  const wiki = [
    { sourceStopId: '10', name: 'ЦУМ "Ташкент"', lat: 41.31, lng: 69.27 },
    { sourceStopId: '11', name: 'Unknown', lat: 41.32, lng: 69.28 },
  ];
  const osm = [
    { id: 'osm:1', canonicalName: 'ЦУМ Ташкент', center: { lat: 41.3102, lng: 69.2701 } },
    { id: 'osm:2', canonicalName: 'Other', center: { lat: 41.3207, lng: 69.28 } },
  ];
  const result = reconcileStopsWithOsm(wiki, osm);
  assert.equal(result[0].osmMatchId, 'osm:1');
  assert.equal(result[1].osmMatchId, null);
});
