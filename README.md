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

Public transport topology is exposed separately from `GEO_ENTITIES` through the `@whiteslove/geo-catalog/transport` subpath:

```js
import {
  TRANSPORT_STOPS,
  TRANSPORT_ROUTES,
  TRANSPORT_TRANSFERS,
  findTransportRoutes,
  findTransportStops,
  getRoutesForStop,
  getStopsForRoute,
  getTransportCoverage,
} from '@whiteslove/geo-catalog/transport';
```

Routes explicitly declare topology coverage:

- `full` — an ordered stop sequence is available and may be used for route traversal;
- `terminals_only` — only verified endpoints are known, so `stopIds` must not be interpreted as a complete route sequence;
- `metadata_only` — the route exists in the registry snapshot, but no spatial stop topology is asserted yet.

`getRoutesForStop(stopId, { requireFullSequence: true })` excludes partial routes from A→B routing consumers.

Tashkent metro stops are derived from canonical metro geo entities so their centers and provenance cannot drift independently. Bus endpoints reuse canonical geo entities whenever an exact semantic owner exists; standalone endpoints require explicit spatial provenance.

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

The catalog is continuously synchronized with canonical geography from `@whiteslove/parsing-lexicon`. It currently includes broad city coverage across Uzbekistan, Ukraine and Kazakhstan, detailed Tashkent administrative and semantic geography, verified metro stations, POIs, streets and other spatial anchors, plus explicit coverage-gap registries for lexicon entities that still need verified geometry.

Public transport is maintained as a separate topology layer. For Tashkent, the current snapshot contains all 170 published city-bus route refs plus the four metro lines. Bus routes are promoted from metadata to endpoint or full topology only when the corresponding spatial evidence is verified.

## Lexicon coverage gate

Development CI installs the current `AmoneMisa/parsing-lexicon` and runs:

```bash
npm run audit:lexicon
```

The audit checks canonical parser geography against exact spatial owners and explicit coverage gaps. Compatible fallback resolution remains available to normal consumers, but it is not allowed to hide a type or parent mismatch during the coverage audit.

If parsing-lexicon introduces a canonical entity without either a matching spatial owner or an explicit tracked gap, CI fails and prints the missing canonical names. The parser package is a development-only audit dependency; `@whiteslove/geo-catalog` remains dependency-free for consumers.

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

## License

MIT
