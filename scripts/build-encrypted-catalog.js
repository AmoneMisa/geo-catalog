import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { UZ_ENTITIES } from '../data-source/uz/index.js';
import { KZ_ENTITIES } from '../data-source/kz/index.js';
import { KG_ENTITIES } from '../data-source/kg/index.js';
import { RO_ENTITIES } from '../data-source/ro/index.js';
import { UA_ENTITIES } from '../data-source/ua/index.js';
import { LEARNED_ADDRESS_ENTITIES } from '../data-source/learned-addresses.js';
import { getDecryptionKey } from '../src/config.js';
import { encryptPayload } from '../src/crypto.js';

const entities = [
  ...UZ_ENTITIES,
  ...KZ_ENTITIES,
  ...KG_ENTITIES,
  ...RO_ENTITIES,
  ...UA_ENTITIES,
  ...LEARNED_ADDRESS_ENTITIES,
];

const key = getDecryptionKey();
const payload = encryptPayload(Buffer.from(JSON.stringify(entities), 'utf8'), key);

const outPath = fileURLToPath(new URL('../src/data/catalog.enc.json', import.meta.url));
await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(payload)}\n`, 'utf8');

console.log(`Encrypted geo catalog written: ${entities.length} entities -> ${outPath}`);
