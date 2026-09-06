import test from 'node:test';
import assert from 'node:assert/strict';

import { getGeoEntity } from '../src/catalog.js';
import { resolveLexiconGeoEntity } from '../src/index.js';

test('Yangi Sergeli residential complex is distinct from the same-name local area', () => {
  const residential = getGeoEntity('uz:tashkent:residential:yangi-sergeli');
  const localArea = getGeoEntity('uz:tashkent:local-area:yangi-sergeli');

  assert.ok(residential);
  assert.ok(localArea);
  assert.equal(residential.type, 'residential_complex');
  assert.equal(localArea.type, 'local_area');
  assert.equal(residential.canonicalName, 'Yangi Sergeli');
  assert.equal(localArea.canonicalName, 'Yangi Sergeli');
  assert.deepEqual(residential.center, { lat: 41.222096, lng: 69.224966 });
  assert.deepEqual(localArea.center, { lat: 41.2228385, lng: 69.2252417 });
  assert.equal(residential.parentId, 'uz:tashkent:sergeli');
  assert.equal(localArea.parentId, 'uz:tashkent:sergeli');
  assert.equal(
    residential.sourceUrl,
    'https://yandex.com/maps/10335/tashkent/geo/yangi_sergeli_turar_joy_majmuasi/3094469731/',
  );
  assert.notDeepEqual(residential.center, localArea.center);
});

test('typed lookup resolves Yangi Sergeli to the requested physical entity', () => {
  const residential = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Tashkent',
    type: 'residential_complex',
    canonical: 'Yangi Sergeli',
  });
  const localArea = resolveLexiconGeoEntity({
    country: 'UZ',
    city: 'Tashkent',
    type: 'local_area',
    canonical: 'Yangi Sergeli',
  });

  assert.equal(residential?.id, 'uz:tashkent:residential:yangi-sergeli');
  assert.equal(localArea?.id, 'uz:tashkent:local-area:yangi-sergeli');
});
