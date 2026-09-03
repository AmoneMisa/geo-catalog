import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TRANSPORT_ROUTES,
  TRANSPORT_ROUTE_VARIANTS,
  TRANSPORT_STOPS,
  findTransportRoutes,
  getTransportRoute,
  getTransportStop,
  validateTransportCatalog,
} from '../src/transport/catalog.js';

test('WikiRoutes bulk import exposes full local-transit topology for canonical cities', () => {
  const wikiRoutes = TRANSPORT_ROUTES.filter((route) => route.source === 'wikiroutes');
  const wikiStops = TRANSPORT_STOPS.filter((stop) => stop.source === 'wikiroutes');
  const wikiVariants = TRANSPORT_ROUTE_VARIANTS.filter((variant) => variant.source === 'wikiroutes');
  const cityIds = new Set(wikiRoutes.map((route) => route.cityId));

  assert.equal(wikiRoutes.length, 3478);
  assert.equal(wikiStops.length, 58684);
  assert.equal(wikiVariants.length, 7061);
  assert.equal(cityIds.size, 52);

  assert.ok(findTransportRoutes({ country: 'RO', cityId: 'ro:bucharest' }).some((route) => route.source === 'wikiroutes'));
  assert.ok(findTransportRoutes({ country: 'UA', cityId: 'ua:kyiv' }).some((route) => route.source === 'wikiroutes'));
  assert.ok(findTransportRoutes({ country: 'UZ', cityId: 'uz:samarkand' }).some((route) => route.source === 'wikiroutes'));
  assert.ok(findTransportRoutes({ country: 'KZ', cityId: 'kz:almaty' }).some((route) => route.source === 'wikiroutes'));
  assert.ok(findTransportRoutes({ country: 'KG', cityId: 'kg:bishkek' }).some((route) => route.source === 'wikiroutes'));
  assert.equal(findTransportRoutes({ cityId: 'uz:tashkent' }).some((route) => route.source === 'wikiroutes'), false);
});

test('WikiRoutes coordinate mask is decoded before data enters the catalog', () => {
  const stop = getTransportStop('ro:bucharest:stop:bus:wikiroutes:1487092');
  assert.ok(stop);
  assert.deepEqual(stop.center, { lat: 44.416578, lng: 26.112582 });

  const route = getTransportRoute('ro:bucharest:route:bus:wikiroutes:46809');
  assert.ok(route);
  assert.equal(route.ref, '323');
  assert.equal(route.coverage, 'full');
  assert.ok(route.variants.length >= 2);

  for (const variant of route.variants) {
    assert.ok(variant.stopIds.length >= 2);
    assert.equal(variant.geometry.type, 'MultiLineString');
    assert.ok(variant.geometry.coordinates[0].length >= 2);
  }
});

test('WikiRoutes expansion keeps the transport catalog valid', () => {
  const result = validateTransportCatalog();
  assert.equal(result.valid, true, result.errors.slice(0, 20).join('\n'));
});
