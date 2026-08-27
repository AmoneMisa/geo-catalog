# AI / Contributor Architecture Rules

This file is mandatory reading before changing geography data, coordinates, spatial logic, lexicon bridging, validation, or public exports in this repository.

## Repository workflow

Do not merge any pull request into `master` without explicit user approval in the current task/conversation. Preparing a branch or PR is allowed; merging is not.

When a PR is approved for merge, use **squash merge only**. Do not use merge commits or rebase-merge for repository changes.

Do not add temporary technical artifacts to the repository: scratch files, migration notes, generated reports, debug scripts, one-off helper files, duplicate documentation, or staging files. Only commit files that belong to the intended architecture or were explicitly requested.

Before writing to `master`, fetch the current `master` again. Do not overwrite unrelated external changes. Prefer one meaningful commit per logical data batch rather than a chain of micro-commits.

## Core rules

Preserve the existing architecture. Do not solve a data-coverage task by introducing a parallel catalog, a second aggregation path, a new public API, or a competing file hierarchy unless the current architecture genuinely cannot represent the data correctly.

Prefer the simplest change that fits the current architecture. Do not add abstractions, wrappers, indirection, compatibility layers, helper modules, or files unless they have a concrete architectural responsibility and remove more complexity than they add.

Do not duplicate physical entities. One real geographic entity must have one canonical owner in the catalog. Alternate spellings, historical names, transliterations, abbreviations, and colloquial names belong in `AmoneMisa/parsing-lexicon`, not as duplicate geo entities here.

The canonical spatial shape is:

`country -> city -> semantic subject modules -> country aggregator -> catalog`

The public canonical registry is `GEO_ENTITIES` from `src/catalog.js`.

## This package owns coordinates

This package is the canonical owner of geographic coordinates and spatial metadata.

The canonical parsing/alias package is:

**https://github.com/AmoneMisa/parsing-lexicon**

Keep latitude/longitude, bounding boxes, map points, OSM metadata, Wikidata/GeoNames provenance, and other spatial metadata in `geo-catalog`.

Do not move coordinate ownership into `parsing-lexicon`. Conversely, do not add large alias dictionaries, misspelling registries, transliteration lists, or language-specific parsing vocabulary here as a shortcut.

If a task requires both lexical parsing and coordinates, add/resolve the canonical lexical entity in `parsing-lexicon` and the spatial entity here, then connect them through the existing bridge/consumer layer.

## `center` is authoritative

`entity.center` is the runtime source of truth for spatial operations.

External identifiers and source metadata such as `osm`, `wikidataId`, `geonamesId`, and `sourceUrl` are provenance/enrichment metadata. They must not be resolved at runtime to replace `center` automatically.

This is deliberate: external providers can contain stale, ambiguous, shifted, or incorrect coordinates. If a trusted external identifier points to a bad coordinate, preserve the verified local `center` and treat the external identifier only as provenance when it still identifies the correct physical entity.

For large areas or multi-building complexes, use a representative centroid/point and set an appropriately wider `accuracyM`. Do not pretend a single building entrance is the exact center of a large district, park, island, mall complex, or residential development.

## Data ownership and directory structure

Country-specific data belongs under `src/data/<country>/` using lowercase ISO alpha-2 directory names.

Country aggregators own country order:

- `src/data/ua/index.js` -> `UA_ENTITIES`
- `src/data/uz/index.js` -> `UZ_ENTITIES`
- `src/data/kz/index.js` -> `KZ_ENTITIES`

A city with multiple subject modules should have a city directory, for example:

`src/data/ua/kyiv/`

City `index.js` files aggregate semantic subject modules such as:

- `districts.js`
- `neighborhoods.js`
- `microdistricts.js`
- `local-areas.js`
- `mahallas.js`
- `metro.js`
- `poi.js`
- `residential-complexes.js`

`src/catalog.js` must remain a small top-level aggregator. It imports country aggregators plus truly global datasets; it must not learn the internal module layout of individual cities.

A leaf city-data module must not import another city's data.

## File naming and complexity

Use lowercase kebab-case filenames and semantic category names.

Do not create chronological/batch files such as:

- `*-extra.js`
- `*-part-2.js`
- `*-new.js`
- `*-more.js`

If an existing semantic module becomes too large, split it by a stable domain or geographic boundary, not by chronology.

Do not create a new file merely to avoid editing the correct existing module. Create files only when they establish a real architectural boundary.

New collections use `*_ENTITIES` exports. Do not introduce new `*_ANCHORS` exports. Existing legacy `*_ANCHORS` names may remain for compatibility and should be migrated when their module is otherwise meaningfully touched.

## Entity identity and canonical names

IDs use lowercase colon-separated scopes and kebab-case slugs, for example:

`ua:kyiv:microdistrict:podil`

`country` uses uppercase ISO alpha-2 codes.

`parentId` must identify the actual spatial parent; do not rely on filename placement to imply it.

`canonicalName` identifies the canonical physical entity used by the geo catalog. It should stay aligned with the canonical lexical entity where practical so `src/lexicon-bridge.js` can resolve it deterministically.

Do not create a second physical entity only to represent an alias. If two names refer to the same place, one remains the geo entity and the alternative name belongs in `parsing-lexicon` aliases.

Do not classify an informal neighborhood, residential area, landmark, planning zone, mall, market, or station as an administrative district merely because listing text calls it a “район”. Use the correct existing geo type.

## Duplicate safety

Every entity must be unique by `id`.

The catalog also rejects semantic duplicates by normalized:

`country + parentId + type + canonicalName`

Do not bypass or weaken this validation to add an alias or duplicate anchor.

Before adding a new entity, search the current catalog for the same physical object under alternate canonical names and nearby types.

## Source and provenance rules

Do not invent coordinates, OSM IDs, Wikidata IDs, GeoNames IDs, addresses, or source URLs.

Prefer authoritative or directly inspectable sources, for example:

1. an official project/venue/municipal source with an explicit address or map location;
2. OpenStreetMap geometry or named place data;
3. Wikidata/GeoNames when the entity and coordinate are unambiguous;
4. reputable mapping/property databases with explicit GPS coordinates.

When sources disagree, verify which record represents the intended physical entity. Omit uncertain metadata rather than guessing.

For derived centroids, derive them from multiple verified constituent points and use a realistic `accuracyM`. Do not present a derived centroid as a precise surveyed point.

`source` should describe the actual basis of the stored spatial data. Do not mark an entity `wikidata` merely because a Wikidata ID is attached if the stored center came from another source.

## Parsing lexicon alignment

`AmoneMisa/parsing-lexicon` owns aliases and lexical coverage. `geo-catalog` owns spatial anchors.

`src/lexicon-bridge.js` is the compatibility layer between canonical lexicon entities and `GEO_ENTITIES`. Extend the existing bridge semantics rather than creating another matching/index implementation.

Do not copy parsing dictionaries into this repository.

When adding geo coverage specifically for lexical entities:

- inspect the current parsing-lexicon `master` first;
- verify that the lexicon candidate refers to a real physical entity in the requested city;
- do not geocode a lexicon mistake merely to obtain 100% coverage;
- if the lexicon contains a false-city or non-physical candidate, fix/remove it in `parsing-lexicon` instead of fabricating an anchor here;
- keep canonical names aligned where possible, or make a deliberate bridge-compatible choice when the real project display name differs.

## Public API

Do not add exports “just in case”.

Prefer extending the existing public objects/functions:

- `GEO_ENTITIES`
- catalog lookup/filter helpers
- spatial helpers
- validation helpers
- `lexicon-bridge`
- lookup-key helpers

A normal geographic data-coverage change should require no public API change.

If compatibility exports are retained, they should reference canonical data rather than maintain another copy.

## Aggregation rules

`src/catalog.js` imports country aggregators only, plus truly global datasets such as learned addresses.

`src/data/<country>/index.js` owns country aggregation order.

City `index.js` files own subject-module aggregation order inside that city.

Moving or splitting files must preserve entity IDs, coordinates, metadata, parent relationships, and aggregation order unless the task explicitly intends to change them.

Do not create a second route by which the same entity reaches `GEO_ENTITIES`.

## Tests required

Every architecture or geography change must keep:

- `npm test`
- `npm run validate`

green.

When changing lexicon alignment, bridge semantics, or lexical coverage, also run:

- `npm run audit:lexicon`

Do not claim tests or CI passed unless they were actually executed or the corresponding GitHub checks are visible and successful.

For architecture changes, add regression assertions that protect architectural invariants, not only one sample entity. Examples:

- `src/catalog.js` still consumes country aggregators rather than city internals;
- duplicate IDs and semantic duplicates remain rejected;
- `center` is preserved as stored catalog data;
- aliases are not represented as duplicate physical entities;
- lexicon bridge resolution remains deterministic for parent/type collisions;
- public lookup/filter functions still return canonical catalog entities;
- splitting a module does not duplicate or reorder entities unexpectedly.

## Before editing

Before making a change, inspect the current `master` and answer these questions internally:

1. Which existing country/city/subject module owns this physical entity?
2. Does this entity already exist under another canonical name, alias, or nearby type?
3. Is the candidate a real physical entity, or only a parsing phrase/listing convention?
4. Is `center` independently defensible, and is `accuracyM` realistic for the object's footprint?
5. Does the attached OSM/Wikidata/GeoNames metadata identify the same physical object?
6. Am I duplicating lexical aliases that belong in `AmoneMisa/parsing-lexicon`?
7. Am I adding a second aggregation path, public API, helper, or registry unnecessarily?
8. Can this be implemented in an existing semantic file instead of creating a batch/temporary file?
9. Which validation/test protects this change from regression?
10. If this task is driven by parsing-lexicon coverage, is the lexicon entry itself correct before I add coordinates for it?

If the answer reveals a conflict with this file, preserve the architecture and data integrity first, then add the requested coverage.

## Updating this document

When the repository architecture or package ownership boundary is intentionally changed, update `AGENTS.md` in the same PR so future AI agents and contributors follow the new canonical structure.

Keep `src/data/README.md` consistent with this document. `AGENTS.md` defines contributor/agent rules; `src/data/README.md` defines concrete data-module conventions.
