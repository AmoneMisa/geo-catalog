import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants } from 'node:zlib';
import { GEO_ENTITIES } from '../src/catalog.js';
import { buildGeoRuntimeIndex, serializeGeoRuntimeIndex } from '../src/runtime-index.js';

/** Generates the compact runtime matching artifact. Run after the catalog
 * build; the output is derived data and is gitignored like the catalog. */

const index = buildGeoRuntimeIndex(GEO_ENTITIES);
const payload = serializeGeoRuntimeIndex(index);
const json = Buffer.from(JSON.stringify(payload), 'utf8');
const compressed = brotliCompressSync(json, {
  params: { [constants.BROTLI_PARAM_QUALITY]: 9, [constants.BROTLI_PARAM_SIZE_HINT]: json.length },
});

const target = fileURLToPath(new URL('../src/data/runtime-index.br', import.meta.url));
writeFileSync(target, compressed);

const mib = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
console.log([
  `Geo runtime index written: ${payload.entities.length} entities -> ${target}`,
  `  json ${mib(json.length)} -> brotli ${mib(compressed.length)}`,
  `  aliases ${index.byNormalizedAlias.size}, tokens ${index.byToken.size}, pairs ${index.byTokenPair.size}, rare grams ${index.byRareGram.size}`,
  `  cities ${index.cityFrequency.size}`,
].join('\n'));
