export * from './index.d.ts';

import type {
  GeoEntity,
  GeoEntityType,
  LexiconGeoEntityInput,
} from './index.d.ts';

export type LexiconLocationBucketType =
  | 'districts'
  | 'microdistricts'
  | 'mahallas'
  | 'localAreas'
  | 'suburbs'
  | 'settlements'
  | 'developmentAreas'
  | 'metro'
  | 'residentialComplexes'
  | 'streets'
  | 'landmarks'
  | 'pois';

export type LexiconRuntimeGeoEntityInput = {
  country: string;
  city?: string;
  type?: GeoEntityType | LexiconLocationBucketType;
} & (
  | { canonical: string; name?: string }
  | { canonical?: string; name: string }
);

export function geoEntityKey(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): string;
export function resolveLexiconGeoEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): Readonly<GeoEntity> | null;
export function geoIdForLexiconEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): string | null;
export function hasLexiconGeoEntity(input: LexiconGeoEntityInput | LexiconRuntimeGeoEntityInput): boolean;

export type GeoRuntimeEntity = Readonly<{
  entityId: string;
  type: string;
  cityId: string | null;
  parentId?: string | null;
  canonical: string;
  aliases: readonly string[];
  normalizedAliases: readonly string[];
  coordinates?: Readonly<{ lat: number; lon: number }>;
  provenance?: unknown;
}>;

export type GeoRuntimeIndex = Readonly<{
  entities: readonly GeoRuntimeEntity[];
  byNormalizedAlias: ReadonlyMap<string, readonly string[]>;
  byToken: ReadonlyMap<string, readonly string[]>;
  byTokenPair: ReadonlyMap<string, readonly string[]>;
  byRareGram: ReadonlyMap<string, readonly string[]>;
  entityToCity: ReadonlyMap<string, string | null>;
  aliasFrequency: ReadonlyMap<string, number>;
  entityFrequency: ReadonlyMap<string, number>;
  cityFrequency: ReadonlyMap<string, number>;
  specificity: ReadonlyMap<string, number>;
  rareLimit: number;
  tokenLimit: number;
}>;

export function normalizeGeoAlias(value: unknown): string;
export function geoAliasTokens(value: unknown): readonly string[];
export function buildGeoRuntimeIndex(entities: readonly unknown[], options?: { rareLimit?: number; tokenLimit?: number }): GeoRuntimeIndex;
export function serializeGeoRuntimeIndex(index: GeoRuntimeIndex): Record<string, unknown>;
export function deserializeGeoRuntimeIndex(payload: unknown): GeoRuntimeIndex;

export type GeoTokenKind = 'alpha' | 'numeric' | 'alphanumeric';
export const TOKEN_KINDS: readonly GeoTokenKind[];
export const NUMERIC_CONFLICT_PENALTY: number;
export const NUMERIC_MISSING_PENALTY: number;

export type ClassifiedGeoTokens = Readonly<{
  tokens: readonly Readonly<{ value: string; kind: GeoTokenKind }>[];
  alpha: readonly string[];
  numeric: readonly string[];
  alphanumeric: readonly string[];
}>;

export type GeoNumericComparison = Readonly<{
  status: 'match' | 'absent' | 'conflict' | 'neutral';
  compatible: boolean;
  penalty: number;
  matched: readonly string[];
  conflicting: readonly string[];
}>;

export function classifyGeoToken(token: unknown): GeoTokenKind;
export function classifyGeoTokens(value: unknown): ClassifiedGeoTokens;
export function compareGeoNumerics(text: unknown, entityName: unknown): GeoNumericComparison;
export function verifyGeoNumericAgreement(text: unknown, entity: { normalizedAliases?: readonly string[]; canonical?: string }): GeoNumericComparison;

// --- Relationship graph -----------------------------------------------------
export type GeoRelation = 'same-parent' | 'same-district' | 'same-city' | 'neighbour' | 'conflict' | 'unknown';
export type GeoNeighbour = Readonly<{ id: string; type: string; km: number }>;
export const NEIGHBOUR_DEFAULTS: Readonly<{ radiusKm: number; limit: number }>;
export type GeoRelationshipGraph = Readonly<{
  parentOf: ReadonlyMap<string, string | null>;
  childrenOf: ReadonlyMap<string, readonly string[]>;
  districtOf: ReadonlyMap<string, string | null>;
  cityOf: ReadonlyMap<string, string | null>;
  regionOf: ReadonlyMap<string, string | null>;
  countryOf: ReadonlyMap<string, string | null>;
  neighbours: ReadonlyMap<string, readonly GeoNeighbour[]>;
  radiusKm: number;
  limit: number;
  ancestorOfType(id: string, type: string): string | null;
}>;
export function buildGeoRelationshipGraph(entities: readonly unknown[], options?: { radiusKm?: number; limit?: number; neighbours?: boolean }): GeoRelationshipGraph;
export function relateGeoEntities(graph: GeoRelationshipGraph, leftId: string | null, rightId: string | null): Readonly<{ relation: GeoRelation; weight: number; km?: number }>;

// --- Transliteration (retrieval only) ---------------------------------------
export function transliterateToLatin(value: unknown): string;
export function geoSkeleton(value: unknown): string;
export function geoSkeletonsOf(entity: { normalizedAliases?: readonly string[]; canonical?: string }): readonly string[];
export function buildSkeletonIndex(entities: readonly GeoRuntimeEntity[]): ReadonlyMap<string, readonly string[]>;

// --- Tiered matching --------------------------------------------------------
export type MatchTier = 'structured' | 'exact' | 'indexed' | 'skeleton' | 'fuzzy' | 'unresolved';
export const MATCH_TIERS: readonly MatchTier[];
export const DEFAULT_TIER_OPTIONS: Readonly<{ maxCandidates: number; minSimilarity: number; minMargin: number }>;
export function resolveGeoText(text: unknown, index: GeoRuntimeIndex, options?: {
  entityId?: string; byId?: ReadonlyMap<string, GeoRuntimeEntity>; skeletonIndex?: ReadonlyMap<string, readonly string[]>;
  maxCandidates?: number; minSimilarity?: number; minMargin?: number;
}): Readonly<{
  tier: MatchTier; entityId: string | null; score?: number; candidateCount: number;
  trace: readonly Readonly<{ tier: MatchTier; candidates: number }>[]; ambiguous?: readonly string[];
}>;

// --- Coordinate precision ---------------------------------------------------
export type GeoPrecision = 'rooftop' | 'building' | 'street' | 'neighbourhood' | 'district' | 'city';
export const GEO_PRECISIONS: readonly GeoPrecision[];
export const PRECISION_UNCERTAINTY_KM: Readonly<Record<GeoPrecision, number>>;
export type GeoPoint = Readonly<{ lat: number; lng: number; precision: GeoPrecision; uncertaintyKm: number; source?: unknown; bbox?: Readonly<{ north: number; south: number; east: number; west: number }> }>;
export function precisionForEntityType(type: unknown): GeoPrecision;
export function createGeoPoint(input: { lat: number; lng: number; precision: GeoPrecision; source?: unknown; bbox?: unknown; uncertaintyKm?: number }): GeoPoint;
export function geoPointForEntity(entity: unknown, options?: { precision?: GeoPrecision; source?: unknown; uncertaintyKm?: number }): GeoPoint | null;
export function coarsestPrecision(...precisions: readonly (GeoPrecision | undefined)[]): GeoPrecision | null;
export function validateAgainstContainer(point: GeoPoint | null, container: unknown): Readonly<{ status: 'consistent' | 'uncertain' | 'inconsistent' | 'unknown'; reason: string; km?: number }>;
export function measuredDistanceKm(from: GeoPoint, to: GeoPoint): Readonly<{ km: number; marginKm: number; precision: GeoPrecision | null; meaningful: boolean }> | null;
