export type GeoPoiType =
  | 'poi.park'
  | 'poi.recreation_area'
  | 'poi.island'
  | 'poi.square'
  | 'poi.street'
  | 'poi.landmark'
  | 'poi.monument'
  | 'poi.fortress'
  | 'poi.embankment'
  | 'poi.lake'
  | 'poi.cathedral'
  | 'poi.stadium'
  | 'poi.cultural_venue'
  | 'poi.exhibition_center'
  | 'poi.zoo'
  | 'poi.shopping_mall'
  | 'poi.market'
  | 'poi.beach'
  | 'poi.memorial'
  | 'poi.university'
  | 'poi.botanical_garden'
  | 'poi.airport'
  | 'poi.railway_station'
  | 'poi.bus_station'
  | 'poi.mosque'
  | 'poi.museum'
  | 'poi.observatory'
  | 'poi.school'
  | 'poi.hospital'
  | 'poi.supermarket'
  | 'poi.amusement_park'
  | 'poi.archaeological_site'
  | 'poi.palace'
  | 'poi.mausoleum'
  | 'poi.religious_complex'
  | 'poi.bridge'
  | 'poi.factory'
  | 'poi.power_plant'
  | 'poi.company'
  | 'poi.bank'
  | 'poi.sanatorium'
  | 'poi.madrasa'
  | 'poi.hardware_store';

export type GeoEntityType =
  | 'country'
  | 'region'
  | 'city'
  | 'district'
  | 'microdistrict'
  | 'mahalla'
  | 'local_area'
  | 'suburb'
  | 'settlement'
  | 'street'
  | 'address'
  | 'residential_complex'
  | 'metro'
  | 'poi'
  | GeoPoiType
  | 'development_area';

export type GeoSource = 'osm' | 'wikidata' | 'official' | 'manual' | 'geonames';
export type GeoAccuracy = 'country' | 'region' | 'city' | 'district' | 'neighborhood' | 'street' | 'building' | 'poi' | 'entrance' | 'approximate';

export interface GeoPoint { lat: number; lng: number }
export interface GeoBBox { south: number; west: number; north: number; east: number }
export interface OsmRef { type: 'node' | 'way' | 'relation'; id: number }

// GeoJSON RFC 7946 position order is [longitude, latitude].
export type GeoPosition = readonly [number, number];
export type GeoLinearRing = readonly GeoPosition[];
export type GeoPolygonCoordinates = readonly GeoLinearRing[];
export interface GeoPolygonGeometry { type: 'Polygon'; coordinates: GeoPolygonCoordinates }
export interface GeoMultiPolygonGeometry { type: 'MultiPolygon'; coordinates: readonly GeoPolygonCoordinates[] }
export type GeoBoundaryGeometry = GeoPolygonGeometry | GeoMultiPolygonGeometry;

export interface GeoEntity {
  id: string;
  type: GeoEntityType;
  country: string;
  canonicalName: string;
  parentId?: string;
  center: GeoPoint;
  bbox?: GeoBBox;
  boundary?: GeoBoundaryGeometry;
  osm?: OsmRef;
  wikidataId?: string;
  accuracyM?: number;
  accuracy?: GeoAccuracy;
  source?: GeoSource;
  sourceUrl?: string;
  lookupKey?: string;
}

export interface GeoEntityFilters {
  country?: string;
  type?: GeoEntityType;
  parentId?: string;
}

export interface LexiconGeoEntityInput {
  country: string;
  city?: string;
  type?: GeoEntityType;
  canonical: string;
}

export interface GeoCoverageGap extends LexiconGeoEntityInput {
  reason: string;
}

export interface GeoLookupKeyParts {
  country: string;
  type?: GeoEntityType | string;
  city?: unknown;
  district?: unknown;
  street?: unknown;
  houseNumber?: unknown;
  building?: unknown;
  canonical?: unknown;
  name?: unknown;
}

export const GEO_ENTITIES: readonly Readonly<GeoEntity>[];
export const GEO_COVERAGE_GAPS: readonly Readonly<GeoCoverageGap>[];
export function getGeoEntity(id: string): Readonly<GeoEntity> | null;
export function getGeoEntityByLookupKey(lookupKey: string): Readonly<GeoEntity> | null;
export function hasGeoEntity(id: string): boolean;
export function findGeoEntities(filters?: GeoEntityFilters): readonly Readonly<GeoEntity>[];
export function getGeoChildren(
  parentId: string,
  filters?: Pick<GeoEntityFilters, 'country' | 'type'>,
): readonly Readonly<GeoEntity>[];
export function getGeoDescendants(
  parentId: string,
  filters?: Pick<GeoEntityFilters, 'country' | 'type'>,
): readonly Readonly<GeoEntity>[];
export function isGeoCoverageGap(input: LexiconGeoEntityInput): boolean;
export function isValidCoordinate(point: GeoPoint | null | undefined): boolean;
export function containsPoint(point: GeoPoint, bbox: GeoBBox): boolean;
export function distanceKm(a: GeoPoint, b: GeoPoint): number;
export function nearestGeoEntity(point: GeoPoint, entities: readonly GeoEntity[], filters?: Pick<GeoEntityFilters, 'country' | 'type'>): { entity: GeoEntity; distanceKm: number } | null;
export function validateGeoCatalog(entities: readonly GeoEntity[]): { valid: boolean; errors: string[] };
export function geoEntityKey(input: LexiconGeoEntityInput): string;
export function resolveLexiconGeoEntity(input: LexiconGeoEntityInput): Readonly<GeoEntity> | null;
export function geoIdForLexiconEntity(input: LexiconGeoEntityInput): string | null;
export function hasLexiconGeoEntity(input: LexiconGeoEntityInput): boolean;
export function buildGeoLookupKey(parts?: GeoLookupKeyParts): string | null;

export interface NearestGeoEntityToMetroResult {
  station: Readonly<GeoEntity>;
  entity: Readonly<GeoEntity>;
  distanceKm: number;
}

export interface NearestParkToMetroResult {
  station: Readonly<GeoEntity>;
  park: Readonly<GeoEntity>;
  distanceKm: number;
}

export interface NearestToMetroInput {
  country: string;
  city?: string;
  canonical: string;
}

export interface NearestFromMetroInput extends NearestToMetroInput {
  /** Type of the source entity being resolved from the lexicon (e.g. 'poi', 'mahalla', 'microdistrict', 'local_area'). Defaults to 'poi'. */
  type?: GeoEntityType;
}

export interface NearestToMetroOptions {
  /** Broad type ('poi', 'mahalla', 'microdistrict', 'local_area', 'address', 'street', ...) or 'poi.<category>' subtype. Defaults to 'poi'. */
  type?: GeoEntityType;
  maxDistanceKm?: number;
  /** Candidate entities to search instead of the static GEO_ENTITIES catalog — e.g. address rows loaded from Postgres. */
  entities?: readonly GeoEntity[];
}

export interface NearestMetroToGeoEntityResult {
  entity: Readonly<GeoEntity>;
  station: Readonly<GeoEntity>;
  distanceKm: number;
}

export interface NearestMetroToParkResult {
  park: Readonly<GeoEntity>;
  station: Readonly<GeoEntity>;
  distanceKm: number;
}

export interface NearestMetroToPointResult {
  station: Readonly<GeoEntity>;
  distanceKm: number;
}

export function nearestGeoEntityToMetro(
  input: NearestToMetroInput,
  options?: NearestToMetroOptions,
): Readonly<NearestGeoEntityToMetroResult> | null;

export function nearestMetroToGeoEntity(
  input: NearestFromMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToGeoEntityResult> | null;

export function nearestMetroToPoint(
  point: GeoPoint,
  options?: { country?: string; maxDistanceKm?: number },
): Readonly<NearestMetroToPointResult> | null;

export function nearestParkToMetro(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestParkToMetroResult> | null;

export function nearestMetroToPark(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToParkResult> | null;

export function nearestPoiToMetro(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestGeoEntityToMetroResult> | null;

export function nearestMetroToPoi(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToGeoEntityResult> | null;

export function nearestMahallaToMetro(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestGeoEntityToMetroResult> | null;

export function nearestMetroToMahalla(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToGeoEntityResult> | null;

export function nearestMicrodistrictToMetro(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestGeoEntityToMetroResult> | null;

export function nearestMetroToMicrodistrict(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToGeoEntityResult> | null;

export function nearestLocalAreaToMetro(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestGeoEntityToMetroResult> | null;

export function nearestMetroToLocalArea(
  input: NearestToMetroInput,
  options?: { maxDistanceKm?: number },
): Readonly<NearestMetroToGeoEntityResult> | null;

/**
 * Nearest address to a metro station, searching a caller-supplied array of
 * address rows (e.g. loaded from Postgres for the relevant city/country)
 * instead of the static catalog. Each row must be shaped like a GeoEntity —
 * at minimum { center: {lat, lng}, country, type: 'address' }.
 */
export function nearestAddressToMetro(
  input: NearestToMetroInput,
  addresses: readonly GeoEntity[],
  options?: { maxDistanceKm?: number },
): Readonly<NearestGeoEntityToMetroResult> | null;

/**
 * Nearest metro station to an address row loaded from Postgres (or any other
 * external store) — pass its geocoded coordinates directly.
 */
export function nearestMetroToAddress(
  addressPoint: GeoPoint,
  options?: { country?: string; maxDistanceKm?: number },
): Readonly<NearestMetroToPointResult> | null;
