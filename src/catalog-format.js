/** The shape of the built catalog artifact, shared by the build script and the
 * loader so the two cannot drift.
 *
 * The artifact is smaller than the catalog it was built from in two ways, and
 * only these two:
 *  - centers are rounded to 7 decimals (~1 cm). That is the precision of
 *    OpenStreetMap itself; the extra digits on computed centroids were noise
 *    far below any entity's `accuracyM`.
 *  - `sourceNames` / `concordances` that merely repeat `canonicalName` / `osm`
 *    are stored as the marker 1 and expanded back to the identical value at
 *    load. Anything that differs in any way is stored in full. */

const COORDINATE_SCALE = 1e7;
const DUPLICATE = 1;

export const roundCoordinate = (value) => Math.round(value * COORDINATE_SCALE) / COORDINATE_SCALE;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const canonicalSourceNames = (entity) => ({ canonical: [entity.canonicalName] });
const osmConcordances = (entity) => ({ osm: [{ type: entity.osm.type, id: entity.osm.id }] });

function compactEntity(entity) {
  const compact = {
    ...entity,
    center: { ...entity.center, lat: roundCoordinate(entity.center.lat), lng: roundCoordinate(entity.center.lng) },
  };
  if (entity.sourceNames && same(entity.sourceNames, canonicalSourceNames(entity))) compact.sourceNames = DUPLICATE;
  if (entity.concordances && entity.osm && same(entity.concordances, osmConcordances(entity))) compact.concordances = DUPLICATE;
  return compact;
}

export function compactEntities(entities) {
  return entities.map(compactEntity);
}

/** Restores duplicated fields in place on freshly parsed (unshared) entities. */
export function expandEntities(entities) {
  for (const entity of entities) {
    if (entity.sourceNames === DUPLICATE) entity.sourceNames = canonicalSourceNames(entity);
    if (entity.concordances === DUPLICATE) entity.concordances = osmConcordances(entity);
  }
  return entities;
}
