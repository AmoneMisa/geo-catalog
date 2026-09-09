#!/usr/bin/env node
/**
 * Runs the review-only city extraction across every supported Geofabrik
 * country cache. It never imports review results into the runtime catalog.
 */
import { access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const INPUTS = Object.freeze({
  UZ: 'uzbekistan-latest.osm.pbf',
  UA: 'ukraine-latest.osm.pbf',
  KG: 'kyrgyzstan-latest.osm.pbf',
  RO: 'romania-latest.osm.pbf',
  KZ: 'kazakhstan-latest.osm.pbf',
});

function fail(message) { throw new Error(`Geofabrik all-country enrichment: ${message}`); }

function parseArgs(argv) {
  const options = { inputDir: join('.cache', 'geofabrik'), profile: 'map-data', radiusKm: '30' };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[++index];
    if (!key?.startsWith('--') || !value) fail('expected optional --input-dir, --profile and --radius-km');
    if (key === '--input-dir') options.inputDir = value;
    else if (key === '--profile') options.profile = value;
    else if (key === '--radius-km') options.radiusKm = value;
    else fail(`unknown argument ${key}`);
  }
  if (!['poi', 'map-data'].includes(options.profile)) fail('--profile must be poi or map-data');
  return options;
}

function runCountry(country, input, options) {
  return new Promise((resolve, reject) => {
    const args = [join(SCRIPT_DIRECTORY, 'enrich-geofabrik-country.js'), '--country', country, '--input', input,
      '--all-cities', '--report-only', '--profile', options.profile, '--radius-km', options.radiusKm,
      '--output', join('.cache', 'geo-enrichment', `${country.toLowerCase()}-city-report-${options.profile}.json`)];
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`${country} extraction exited ${code}`)));
  });
}

const options = parseArgs(process.argv.slice(2));
for (const [country, filename] of Object.entries(INPUTS)) {
  const input = join(options.inputDir, filename);
  try { await access(input); } catch { fail(`missing ${country} input: ${input}`); }
  console.log(`\n=== ${country}: ${input} ===`);
  await runCountry(country, input, options);
}
