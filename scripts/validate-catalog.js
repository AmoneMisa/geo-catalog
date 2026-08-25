import { GEO_ENTITIES } from '../src/catalog.js';
import { validateGeoCatalog } from '../src/validate.js';

const result = validateGeoCatalog(GEO_ENTITIES);
if (!result.valid) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}
console.log(`Geo catalog valid: ${GEO_ENTITIES.length} entities`);
