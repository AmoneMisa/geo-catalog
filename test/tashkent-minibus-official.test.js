import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TASHKENT_MINIBUS_OFFICIAL_REGISTRY,
  TASHKENT_MINIBUS_OFFICIAL_SOURCE,
} from '../src/transport/tashkent-minibus-official-registry.js';

test('Tashkent official minibus registry keeps the published 32-row snapshot', () => {
  assert.equal(TASHKENT_MINIBUS_OFFICIAL_REGISTRY.length, 32);
  assert.equal(new Set(TASHKENT_MINIBUS_OFFICIAL_REGISTRY.map((row) => row.ref)).size, 32);
  assert.equal(TASHKENT_MINIBUS_OFFICIAL_SOURCE.source, 'official');
  assert.equal(TASHKENT_MINIBUS_OFFICIAL_SOURCE.license, 'CC BY 4.0');
});

test('official minibus rows preserve route evidence without inferring activity from contract end', () => {
  const row31m = TASHKENT_MINIBUS_OFFICIAL_REGISTRY.find((row) => row.ref === '31m');
  const row186m = TASHKENT_MINIBUS_OFFICIAL_REGISTRY.find((row) => row.ref === '186m');

  assert.deepEqual(
    { from: row31m?.from, to: row31m?.to, contractEnd: row31m?.contractEnd },
    {
      from: 'Qorasuv 1-mavzesi',
      to: 'Buyuk Ipak yo‘li metrosi',
      contractEnd: '2026-01-27',
    },
  );
  assert.equal(row186m?.contractEnd, '2030-01-26');
  assert.equal('active' in row31m, false);
});
