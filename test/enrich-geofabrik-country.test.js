import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('country PBF orchestrator remains catalog-driven and review-gated', async () => {
  const source = await readFile(new URL('../scripts/enrich-geofabrik-country.js', import.meta.url), 'utf8');
  assert.match(source, /GEO_ENTITIES/);
  assert.match(source, /CITIES_BY_COUNTRY/);
  assert.match(source, /fillMissingCityCenters/);
  assert.match(source, /cityScopeRadiusKm/);
  assert.match(source, /cityDistanceKm/);
  assert.match(source, /45% factor keeps two fallback scopes disjoint/);
  assert.match(source, /needs-city-center/);
  assert.match(source, /boundaryNamesFor/);
  assert.match(source, /loadLocalCatalogKey/);
  assert.match(source, /GEO_CATALOG_DECRYPTION_KEY=/);
  assert.match(source, /--all-cities/);
  assert.match(source, /--report-only/);
  assert.match(source, /--apply-reviewed requires explicit --city values/);
  assert.match(source, /not-applied-no-review/);
  assert.match(source, /--input <country\.osm\.pbf>/);
  assert.match(source, /needs-city-owner/);
  assert.match(source, /import-geofabrik-pbf\.js/);
  assert.match(source, /generate-osm-poi-module\.js/);
  assert.match(source, /GeoCatalogOsmPoiReview|createOsmPoiReview/);
  assert.match(source, /--review-dir/);
  assert.doesNotMatch(source, /from ['"](?:osmium|gdal|@mapbox|protobufjs)/);
});
