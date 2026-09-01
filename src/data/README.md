# Geo data module conventions

## Directory layout

Country-specific data lives under `src/data/<country>/` using lowercase ISO alpha-2 codes:

```text
src/data/
  ua/
    index.js
    cities.js
    kyiv/
      index.js
      districts.js
      neighborhoods.js
      poi.js
      residential-complexes.js
  uz/
    index.js
    cities.js
    tashkent/
      index.js
      districts.js
      metro.js
      microdistricts.js
      local-areas.js
      mahallas.js
      poi.js
      residential-complexes.js
  kz/
    index.js
    cities.js
```

Use a city directory when that city has multiple subject modules. Country-wide datasets stay directly under the country directory.

## City coverage order

For a new city or a material expansion of an existing city, verify the current administrative hierarchy first.

The default coverage order is:

`city -> administrative districts -> microdistricts/neighborhoods/local areas -> residential complexes -> POIs/parks/malls -> streets/transport/other enrichment`

- If the city has current official administrative districts (or equivalent first-level municipal divisions), add all verified districts before prioritizing finer-grained city-local data.
- Every district must have a defensible `center` and realistic `accuracyM`; add official boundary geometry or a defensible `bbox` when available, but never fabricate geometry.
- Align district canonicals with `parsing-lexicon`; historical or renamed forms belong there as aliases.
- A large amount of microdistrict, POI, residential-complex, or landmark coverage does not make a city substantially/full populated while its administrative district layer is missing.
- If the city has no current administrative district division, verify that fact explicitly instead of inventing districts.
- Informal areas described as “район” in listing text are not administrative districts unless authoritative sources establish that status.

## File names

- Use lowercase kebab-case.
- Name files by semantic category, not by batch or chronology.
- Preferred names: `cities.js`, `districts.js`, `neighborhoods.js`, `microdistricts.js`, `local-areas.js`, `mahallas.js`, `metro.js`, `poi.js`, `residential-complexes.js`.
- Do not create `*-extra.js`, `*-part-2.js`, `*-new.js`, or similarly chronological data modules.
- If an existing category becomes large, split it by stable domain/geography, e.g. `microdistricts-chilanzar.js`, not `microdistricts-extra.js`.
- CI enforces the `*-extra.js` prohibition under `src/data`.

## Exports

New entity collections use `*_ENTITIES` names.

- Country aggregator: `UA_ENTITIES`, `UZ_ENTITIES`, `KZ_ENTITIES`.
- Country city anchors: `UA_CITY_ENTITIES`, `UZ_CITY_ENTITIES`, `KZ_CITY_ENTITIES`.
- City aggregator: `UA_KYIV_ENTITIES`, `UZ_TASHKENT_ENTITIES`.
- Subject collection: `<COUNTRY>_<CITY>_<CATEGORY>_ENTITIES`, for example `UA_KYIV_DISTRICT_ENTITIES` or `UZ_TASHKENT_METRO_ENTITIES`.

Do not introduce new `*_ANCHORS` export names. Existing ones are legacy-compatible and should be migrated when their module is otherwise touched.

## Aggregation rules

- `src/catalog.js` imports country aggregators only, plus truly global datasets.
- `src/data/<country>/index.js` owns the order of all entities for that country.
- City `index.js` files own the order of subject modules inside that city.
- A leaf data module must not import another city's data.
- Moving or splitting files must preserve entity IDs, coordinates, metadata, and aggregation order unless the change explicitly intends to modify data.

## Entity naming

- IDs use lowercase colon-separated scopes and kebab-case slugs, e.g. `ua:kyiv:microdistrict:podil`.
- `country` is uppercase ISO alpha-2.
- `parentId` points to the spatial parent and must not be inferred from filename placement alone.
- `canonicalName` is the canonical display/search name; aliases belong in the parsing lexicon, not as duplicate geo entities.

## Duplicate safety

Every entity must remain unique by `id`. The catalog also rejects semantic duplicates by normalized `country + parentId + type + canonicalName`. Do not add a second anchor merely to represent an alias or alternate spelling.
