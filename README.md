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

## Public transport topology

Routes are stored separately from `GEO_ENTITIES` because a route is a graph/topology object, not a point geometry. Transport stops remain spatial points and may reference an existing geo entity through `geoEntityId`.

```js
import {
  findTransportRoutes,
  getStopsForRoute,
  getTransportCoverage,
} from '@whiteslove/geo-catalog/transport';

const metro = findTransportRoutes({
  country: 'UZ',
  cityId: 'uz:tashkent',
  mode: 'metro',
  coverage: 'full',
});

const stops = getStopsForRoute('uz:tashkent:route:metro:chilonzor');
const busCoverage = getTransportCoverage({ cityId: 'uz:tashkent', mode: 'bus' });
```

Route coverage is explicit:

- `full` — verified ordered stop sequence, safe for topology/navigation consumers;
- `terminals_only` — verified terminals but incomplete intermediate sequence;
- `metadata_only` — route exists in the current registry, but no verified stop sequence is stored yet.

The Tashkent bus layer is snapshot-aware because routes change frequently. Consumers should use `sourceUpdatedAt`, `validFrom` and `validTo` when available rather than assuming route metadata is immutable.

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

Uzbekistan, Kazakhstan and Ukraine city layers are synchronized with the parser catalog, with increasingly detailed administrative, neighborhood, transport and POI coverage added incrementally. Tashkent includes administrative boundaries, metro stations and transport topology; the bus registry is represented as a freshness-aware snapshot and promoted from metadata to full stop topology only when verified sequences are available.

## Lexicon coverage gate

Development CI installs the current `AmoneMisa/parsing-lexicon` and runs:

```bash
npm run audit:lexicon
```

If a new canonical parser entity covered by the audit is added without a matching geo entity, CI fails and prints the missing canonical names. The parser package is a development-only audit dependency; `@whiteslove/geo-catalog` remains dependency-free for consumers.

## Data-quality rules

- IDs are unique and stable once published.
- Country codes use ISO 3166-1 alpha-2 uppercase values.
- Centers must be valid WGS84 latitude/longitude coordinates.
- A center must lie inside its bbox when a bbox is supplied.
- Administrative boundary geometry must be a non-empty, closed GeoJSON Polygon or MultiPolygon with valid WGS84 positions, and its entity center must lie inside it.
- `parentId` must resolve to another catalog entity.
- OSM references must identify a valid node, way or relation ID.
- Transport routes must declare topology coverage explicitly; incomplete route metadata must not be treated as navigable stop sequences.
- Text aliases and transliterations must not be duplicated here.
- Approximate data must be marked as such instead of pretending to be precise.
- Network geocoding is never performed during package import or lookup.

## License

MIT