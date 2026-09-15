import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const memoryBeforeImport = process.memoryUsage();
const started = performance.now();
const { resolveLexiconGeoEntity } = await import('../src/index.js');
const importMs = performance.now() - started;
const corpus = JSON.parse(readFileSync(new URL('../test/fixtures/matching-baseline.json', import.meta.url), 'utf8'));
const cases = corpus.map(fixture => {
  const started = performance.now(); const result = resolveLexiconGeoEntity(fixture.input);
  const firstCallMs = performance.now() - started;
  const samples = [];
  for (let i = 0; i < 100; i++) {
    const started = performance.now(); resolveLexiconGeoEntity(fixture.input); samples.push(performance.now() - started);
  }
  samples.sort((a,b) => a-b);
  return { id: fixture.id, actual: result?.id ?? null, expected: fixture.expected, correct: (result?.id ?? null) === fixture.expected, firstCallMs, p50Ms: samples[49], p95Ms: samples[94], candidateCount: null };
});
console.log(JSON.stringify({ node: process.version, commit: execFileSync('git', ['rev-parse','HEAD'], { encoding: 'utf8' }).trim(), importMs, memoryBeforeImport, memoryAfter: process.memoryUsage(), maxRssKiB: process.resourceUsage().maxRSS, metricScope: 'Synthetic bridge regression cases; candidate counts are not exposed by the public API. No catalog-wide verification.', cases }, null, 2));
