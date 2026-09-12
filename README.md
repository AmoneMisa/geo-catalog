# @whiteslove/geo-catalog

Structured geographic data for location-aware Whiteslove services.

`@whiteslove/geo-catalog` is the spatial companion to `@whiteslove/parsing-lexicon`. The lexicon recognizes multilingual location text and resolves it to canonical geography; this package attaches deterministic spatial metadata such as coordinates, bounds, hierarchy and optional OpenStreetMap references.

The package is dependency-free and network-free at runtime. Nominatim, Overpass and other geocoders remain ingestion/maintenance tools or consumer fallbacks for unknown exact addresses.

## Responsibilities

This package owns:

- stable geographic entity IDs;
- center coordinates;
- bounding boxes and GeoJSON administrative boundaries;
- administrative and locality hierarchy via `parentId`;
- cities, districts, microdistricts, mahallas, local areas, suburbs and settlements;
- residential complexes, metro stations and POIs;
- optional OSM node/way/relation metadata;
- spatial helpers such as distance, containment and nearest-entity lookup;
- catalog validation and data-quality invariants.

This package intentionally does **not** own multilingual aliases, regexes, parsing heuristics or free-text normalization. Those remain in `@whiteslove/parsing-lexicon`.

## Architecture

```text
raw listing text
  -> @whiteslove/parsing-lexicon
  -> canonical entity tuple
  -> @whiteslove/geo-catalog lexicon bridge
  -> stable geo id
  -> center / bbox / hierarchy / OSM metadata
  -> geocoder fallback only for unresolved exact addresses
```

The bridge uses canonical parser fields rather than copying aliases into this package:

```js
import { resolveLexiconGeoEntity } from '@whiteslove/geo-catalog';

resolveLexiconGeoEntity({
  country: 'UZ',
  city: 'Tashkent',
  type: 'district',
  canonical: 'Chilanzar',
});
// -> { id: 'uz:tashkent:chilanzar', ... }
```

## Usage

```js
import {
  getGeoEntity,
  findGeoEntities,
  nearestGeoEntity,
  containsPoint,
  geoIdForLexiconEntity,
} from '@whiteslove/geo-catalog';

const tashkent = getGeoEntity('uz:tashkent');
console.log(tashkent.center);

const ukrainianCities = findGeoEntities({ country: 'UA', type: 'city' });

const districtId = geoIdForLexiconEntity({
  country: 'UZ', city: 'Tashkent', type: 'district', canonical: 'Chilanzar',
});

const nearest = nearestGeoEntity(
  { lat: 43.24, lng: 76.89 },
  findGeoEntities({ country: 'KZ', type: 'city' }),
);

if (tashkent.bbox) containsPoint(tashkent.center, tashkent.bbox);
```

## Transport catalog

Public transport topology is exposed separately from `GEO_ENTITIES` through:

```js
import {
  TRANSPORT_STOPS,
  TRANSPORT_ROUTES,
  TRANSPORT_ROUTE_VARIANTS,
  TRANSPORT_TRANSFERS,
  findTransportRoutes,
  findTransportStops,
  findTransportRouteVariants,
  getRoutesForStop,
  getStopsForRoute,
  getRouteVariants,
  getStopsForRouteVariant,
  getTransportCoverage,
} from '@whiteslove/geo-catalog/transport';
```

Routes explicitly declare topology coverage:

- `full` — at least one verified ordered stop sequence is available directly on `stopIds` or through a directional `variant`; it does **not** imply both travel directions are mapped;
- `terminals_only` — only verified endpoints are known; do not treat `stopIds` as a full route sequence;
- `metadata_only` — the route is present in the registry snapshot, but no spatial stop topology is asserted yet.

Directional road-transport topology is modeled separately from the route registry object. Each accepted OSM, official bus-registry or EasyWay marshrutka direction becomes a stable `route_variant` with its own source identity, `from`, `to`, geometry and ordered `stopIds`. This preserves asymmetric outbound/inbound stop sequences instead of flattening two directions into one incorrect list. Consumers requiring both directions should inspect the returned variants rather than interpreting route-level `full` as bidirectional completeness.

`getRoutesForStop(stopId, { requireFullSequence: true })` includes a route when the stop appears in a verified full sequence, including an OSM route variant. `getRouteVariants(routeId)` returns all directional variants; `getStopsForRouteVariant(routeId, variantId)` resolves one ordered sequence.

The current Tashkent transport snapshot exposes 237 route objects total: 4 full metro routes, 171 bus route refs including the named `Express` service, and 62 marshrutka routes. Of the bus registry, 150 refs have at least one full directional sequence, 1 retains verified terminal-only coverage, and 20 remain metadata-only. The official bus snapshot dated 2026-08-31 contributes 180 directional variants and 3,270 direction-scoped stop records for 90 routes, alongside the independently maintained OSM snapshot. The EasyWay snapshot from the same date contributes 124 full directional variants and 2,042 provider-scoped stops for all 62 marshrutka routes. Incomplete relations are not promoted to full coverage, and radius-query false positives are excluded using municipal network/operator evidence.

Tashkent metro stops are derived from canonical metro geo entities so their centers and provenance cannot drift independently. Manual bus endpoints continue to reuse canonical geo entities whenever an exact semantic owner exists; standalone endpoint anchors require explicit spatial provenance. A route endpoint may intentionally be a verified locality anchor rather than a platform/stop position, in which case its `accuracy`/`accuracyM` records that lower precision explicitly. OSM route-variant stops use stable IDs based on their OSM element type and ID.

OpenStreetMap-derived transport topology is maintained under the ODbL and records the source snapshot date in generated data. Official bus-feed and EasyWay marshrutka topology retain their own source markers and snapshot dates rather than being mislabeled as OSM. Raw provider responses are ingestion artifacts rather than runtime dependencies; the package ships only normalized stops, map geometry and ordered route variants.

## Entity model

```ts
interface GeoEntity {
  id: string;
  type: GeoEntityType;
  country: string;
  canonicalName: string;
  parentId?: string;
  center: { lat: number; lng: number };
  bbox?: { south: number; west: number; north: number; east: number };
  boundary?: GeoPolygonGeometry | GeoMultiPolygonGeometry;
  osm?: { type: 'node' | 'way' | 'relation'; id: number };
  accuracyM?: number;
  accuracy?: GeoAccuracy;
  source?: 'osm' | 'official' | 'manual';
}
```

IDs are deliberately language-independent. Aliases such as `Чиланзар`, `Chilonzor` and `Чилонзор` belong to the lexicon; they all resolve to the same geo entity.

## Current coverage

`0.9.x` covers five countries across administrative, locality, residential and POI layers. Snapshot as built by `npm run build:catalog` at `0.9.16`:

| Country | Cities | Entities |
| --- | ---: | ---: |
| Ukraine (UA) | 91 | 62,487 |
| Kazakhstan (KZ) | 75 | 29,775 |
| Romania (RO) | 34 | 20,307 |
| Uzbekistan (UZ) | 41 | 18,890 |
| Kyrgyzstan (KG) | 33 | 9,614 |
| **Total** | **274** | **141,073** |

By entity type, the catalog is dominated by street-level coverage (117,647 `street` entities) and local areas/mahallas (10,377 `local_area`, 154 `mahalla`), with the remainder spread across `microdistrict` (663), `residential_complex` (1,522), `district` (122), `metro` (89) and POI subtypes (schools, kindergartens, clinics, parks, hospitals, universities and more, each its own `poi.*` type). Tashkent's administrative districts include stored OSM boundaries and boundary-derived representative centers, so consumers can render those polygons directly instead of approximating extents with radius circles.

Run `node scripts/build-encrypted-catalog.js` (or `npm test`, which builds as a pretest step) to regenerate this snapshot from the current `data-source/` tree; entity counts grow as new cities and layers are reviewed.

## Lexicon coverage gate

Development CI installs the current `AmoneMisa/parsing-lexicon` and runs:

```bash
npm run audit:lexicon
```

The audit currently enforces complete coverage for:

- `UZ_CITIES`;
- `KZ_CITIES`;
- `UA_CITIES`;
- `TASHKENT_DISTRICTS`.

If a new canonical parser city/district is added without a matching geo entity, CI fails and prints the missing canonical names. The parser package is a development-only audit dependency; `@whiteslove/geo-catalog` remains dependency-free for consumers.

## Data-quality rules

- IDs are unique and stable once published.
- Country codes use ISO 3166-1 alpha-2 uppercase values.
- Centers must be valid WGS84 latitude/longitude coordinates.
- A center must lie inside its bbox when a bbox is supplied.
- Administrative boundary geometry must be a non-empty, closed GeoJSON Polygon or MultiPolygon with valid WGS84 positions, and its entity center must lie inside it.
- `parentId` must resolve to another catalog entity.
- OSM references must identify a valid node, way or relation ID.
- Text aliases and transliterations must not be duplicated here.
- Approximate data must be marked as such instead of pretending to be precise.
- Network geocoding is never performed during package import or lookup.
- Canonical and source names must not mix visually identical Latin/Cyrillic letters within one word (e.g. a Cyrillic "о" inside an otherwise Latin street name). The OSM importer folds these confusables toward the name's dominant script before slugging; genuinely bilingual names (brand names, transliteration pairs) are left mixed and allow-listed in `test/catalog.test.js`.
- A Wikidata id identifies one physical entity regardless of how the catalog types it (e.g. a reviewed `metro` station vs. an imported `poi.railway_station` candidate). `mergeOsmPoiCandidates` matches on Wikidata id across types so the same place is never kept as two entities.

## License

MIT
