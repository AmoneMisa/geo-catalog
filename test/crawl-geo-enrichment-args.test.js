import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts', 'crawl-geo-enrichment.js');

function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env },
  });
}

test('crawl:geo accepts --all-cities as the country-level execution mode', () => {
  const result = run(['--country=UZ', '--all-cities', '--providers=not-a-provider']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /No supported providers selected/);
  assert.doesNotMatch(result.stderr, /Usage: npm run crawl:geo/);
});

test('crawl:geo enumerates country cities from geo-catalog even when the lexicon has no country dictionary', () => {
  const result = run(['--country=KG', '--all-cities', '--providers=not-a-provider']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /No supported providers selected/);
  assert.doesNotMatch(result.stderr, /No LOCATION_DICTIONARIES entry/);
  assert.doesNotMatch(result.stderr, /No city entities in geo catalog/);
});

test('crawl:geo rejects --city together with --all-cities', () => {
  const result = run(['--country=UZ', '--city=Tashkent', '--all-cities']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /either --city=<name> or --all-cities/);
});

test('crawl:geo validates country city concurrency before network work', () => {
  const result = run(['--country=UZ', '--all-cities', '--concurrency=0']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--concurrency must be an integer between 1 and 32/);
});
