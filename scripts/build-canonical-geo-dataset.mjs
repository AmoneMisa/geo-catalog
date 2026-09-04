#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TYPE_ID = Object.freeze({
  district: 'district',
  local_area: 'local-area',
  microdistrict: 'microdistrict',
  residential_complex: 'residential',
  street: 'street',
});

const REQUIRED_LANGUAGES = Object.freeze({
  KZ: ['kk', 'ru', 'en'],
  KG: ['ky', 'ru', 'en'],
  UZ: ['uz', 'ru', 'en'],
  UA: ['uk', 'ru', 'en'],
});

const MERGE_RADIUS_M = Object.freeze({
  district: 3000,
  local_area: 2500,
  microdistrict: 2500,
  residential_complex: 800,
  street: Infinity,
});

const GENERIC_NAME_VALUES = [
  'жк', 'тжк', 'жилой комплекс', 'жилой массив', 'жилмассив',
  'housing complex', 'residential complex', 'microdistrict', 'микрорайон',
  'district', 'район', 'аудан', 'tuman', 'street', 'улица', 'вулиця',
  'avenue', 'проспект', 'lane', 'переулок', 'провулок',
];
let GENERIC_NAMES;

const TYPE_PREFIXES = [
  /^жил(?:ой|ой\s+)?\s*массив\s+/iu,
  /^жилмассив\s+/iu,
  /^микрорайон\s+/iu,
  /^мкр\.?\s+/iu,
  /^жил(?:ой|ий)\s+комплекс\s+/iu,
  /^житловий\s+комплекс\s+/iu,
  /^жк\s+/iu,
  /^тжк\s+/iu,
  /^residential\s+complex\s+/iu,
  /^housing\s+complex\s+/iu,
  /^улица\s+/iu,
  /^ул\.?\s+/iu,
  /^вулиця\s+/iu,
  /^вул\.?\s+/iu,
  /^проспект\s+/iu,
  /^просп\.?\s+/iu,
  /^переулок\s+/iu,
  /^пер\.?\s+/iu,
  /^провулок\s+/iu,
  /^бульвар\s+/iu,
  /^street\s+/iu,
  /^avenue\s+/iu,
  /^boulevard\s+/iu,
  /^lane\s+/iu,
  /^район\s+/iu,
  /^аудан\s+/iu,
  /^tuman\s+/iu,
  /^махалла\s+/iu,
  /^mahalla\s+/iu,
];

const CYR = Object.freeze({
  А:'A',а:'a',Б:'B',б:'b',В:'V',в:'v',Г:'G',г:'g',Д:'D',д:'d',Е:'E',е:'e',Ё:'Yo',ё:'yo',Ж:'Zh',ж:'zh',З:'Z',з:'z',И:'I',и:'i',Й:'Y',й:'y',К:'K',к:'k',Л:'L',л:'l',М:'M',м:'m',Н:'N',н:'n',О:'O',о:'o',П:'P',п:'p',Р:'R',р:'r',С:'S',с:'s',Т:'T',т:'t',У:'U',у:'u',Ф:'F',ф:'f',Х:'Kh',х:'kh',Ц:'Ts',ц:'ts',Ч:'Ch',ч:'ch',Ш:'Sh',ш:'sh',Щ:'Shch',щ:'shch',Ъ:'',ъ:'',Ы:'Y',ы:'y',Ь:'',ь:'',Э:'E',э:'e',Ю:'Yu',ю:'yu',Я:'Ya',я:'ya',
  І:'I',і:'i',Ї:'Yi',ї:'yi',Є:'Ye',є:'ye',Ґ:'G',ґ:'g',
  Ә:'A',ә:'a',Ғ:'Gh',ғ:'gh',Қ:'Q',қ:'q',Ң:'Ng',ң:'ng',Ө:'O',ө:'o',Ұ:'U',ұ:'u',Ү:'U',ү:'u',Һ:'H',һ:'h',
  Ў:'O',ў:'o',Ҳ:'H',ҳ:'h',
});

function cleanText(v) {
  return String(v ?? '').replace(/\s+/g, ' ').trim();
}

function transliterate(v) {
  return [...cleanText(v)].map((ch) => CYR[ch] ?? ch).join('');
}

function normalize(v) {
  return transliterate(v)
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[’ʻʼ‘`´]/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function stripTypePrefix(v) {
  let out = cleanText(v);
  for (const rx of TYPE_PREFIXES) out = out.replace(rx, '');
  return out.replace(/^[\s,.;:–—-]+|[\s,.;:–—-]+$/g, '').trim();
}

function slug(v) {
  return normalize(v).replace(/\s+/g, '-').replace(/^-+|-+$/g, '') || 'unnamed';
}

GENERIC_NAMES = new Set(GENERIC_NAME_VALUES.map(normalize));

function validPoint(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    && !(Math.abs(lat) < 1e-9 && Math.abs(lng) < 1e-9);
}

function haversineM(a, b) {
  const rad = (deg) => deg * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function median(values) {
  const v = [...values].sort((a,b) => a-b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m-1] + v[m]) / 2;
}

function stableSource(source) {
  return {
    provider: source.provider ?? null,
    providerId: source.providerId != null ? String(source.providerId) : null,
    name: cleanText(source.name) || null,
    address: cleanText(source.address) || null,
    lat: Number.isFinite(Number(source.lat)) ? Number(source.lat) : null,
    lng: Number.isFinite(Number(source.lng)) ? Number(source.lng) : null,
    requestedType: source.requestedType ?? null,
    rawKind: source.rawKind ?? null,
    objectUrl: source.objectUrl ?? null,
    pageUrl: source.pageUrl ?? null,
    query: source.query ?? null,
    capture: source.capture ?? null,
    distanceToCityM: Number.isFinite(Number(source.distanceToCityM)) ? Number(source.distanceToCityM) : null,
    qualityScore: Number.isFinite(Number(source.qualityScore)) ? Number(source.qualityScore) : null,
  };
}

function observedAliases(members) {
  const set = new Map();
  for (const member of members) {
    const names = [member.name, ...member.sources.map((s) => s.name)];
    for (const name of names) {
      const text = cleanText(name);
      if (!text) continue;
      const key = normalize(text);
      if (!set.has(key)) set.set(key, text);
    }
  }
  return [...set.values()].sort((a,b) => a.localeCompare(b, 'ru'));
}

function chooseDisplayName(members) {
  return [...members].sort((a,b) => {
    const aq = Math.max(...a.sources.map((s) => Number(s.qualityScore) || 0), 0);
    const bq = Math.max(...b.sources.map((s) => Number(s.qualityScore) || 0), 0);
    if (bq !== aq) return bq - aq;
    return cleanText(a.name).length - cleanText(b.name).length;
  })[0].name;
}

function buildEntity(members, conflict = null) {
  const first = members[0];
  const displayName = cleanText(chooseDisplayName(members));
  const baseName = stripTypePrefix(displayName) || displayName;
  const aliases = observedAliases(members);
  const latin = transliterate(baseName);
  const sourceRows = members.flatMap((m) => m.sources.map(stableSource));
  const sourceKeys = new Set();
  const sources = sourceRows.filter((s) => {
    const key = `${s.provider}|${s.providerId ?? ''}|${s.name ?? ''}|${s.lat ?? ''}|${s.lng ?? ''}`;
    if (sourceKeys.has(key)) return false;
    sourceKeys.add(key);
    return true;
  });
  const lat = median(members.map((m) => Number(m.lat)));
  const lng = median(members.map((m) => Number(m.lng)));
  const coordinateSpreadM = Math.round(Math.max(0, ...members.map((m) => haversineM({lat,lng}, m))));
  const providers = [...new Set(sources.map((s) => s.provider).filter(Boolean))].sort();
  const qualityScore = Math.max(...sources.map((s) => s.qualityScore ?? 0), 0);
  const confidence = providers.length >= 2 && coordinateSpreadM <= 250 ? 'high'
    : providers.length >= 2 && coordinateSpreadM <= 1000 ? 'medium'
    : qualityScore >= 0.86 ? 'strong-single-source'
    : 'single-source';
  const typeId = TYPE_ID[first.type] ?? first.type;
  const baseKey = `${first.country.toLowerCase()}:${slug(first.city)}:${typeId}:${slug(baseName)}`;
  const disambiguatorSource = sources.find((s) => s.providerId)?.providerId || null;
  const conflictSuffix = conflict
    ? `--${disambiguatorSource ? `src-${slug(disambiguatorSource)}` : `geo-${String(lat.toFixed(5)).replace('.', '-')}-${String(lng.toFixed(5)).replace('.', '-')}`}`
    : '';
  const entityKey = `${baseKey}${conflictSuffix}`;
  const generic = GENERIC_NAMES.has(normalize(displayName)) || GENERIC_NAMES.has(normalize(baseName));
  const invalid = !validPoint(lat,lng);
  const status = invalid || generic ? 'rejected' : conflict ? 'review' : 'accepted';
  const rejectReason = invalid ? 'invalid_coordinates' : generic ? 'generic_name' : null;

  return {
    entityKey,
    country: first.country,
    city: first.city,
    type: first.type,
    canonical: {
      displayName,
      baseName,
      slug: slug(baseName),
    },
    names: {
      observed: aliases,
      latinTransliteration: latin && normalize(latin) !== normalize(baseName) ? latin : null,
      translations: {},
      requiredLanguages: REQUIRED_LANGUAGES[first.country] ?? ['en'],
      translationStatus: 'pending_lexicon_enrichment',
    },
    location: { lat, lng },
    evidence: {
      providers,
      providerCount: providers.length,
      coordinateSpreadM,
      confidence,
      sourceCount: sources.length,
      sources,
    },
    status,
    ...(rejectReason ? { rejection: { reason: rejectReason } } : {}),
    ...(conflict ? { review: conflict } : {}),
    resolution: {
      geoCatalog: 'pending_match',
      parsingLexicon: 'pending_match',
    },
    provenance: {
      mergedCleanEntities: members.length,
    },
  };
}

function parseRejectReason(reason) {
  const text = String(reason ?? 'unknown');
  const m = /^outside_city_scope_(\d+(?:\.\d+)?)km$/i.exec(text);
  if (m) return { code: 'outside_city_scope', distanceKm: Number(m[1]) };
  return { code: text };
}

async function main() {
  const [cleanArg, rejectedArg, outArg] = process.argv.slice(2);
  if (!cleanArg) {
    console.error('Usage: node scripts/build-canonical-geo-dataset.mjs entities.cleaned.json [rejected.jsonl] [output.json]');
    process.exit(2);
  }
  const cleanPath = path.resolve(cleanArg);
  const rejectedPath = rejectedArg ? path.resolve(rejectedArg) : null;
  const outPath = path.resolve(outArg || 'clean-geo-canonical.json');

  const clean = JSON.parse(await readFile(cleanPath, 'utf8'));
  const input = Array.isArray(clean.entities) ? clean.entities : [];

  const buckets = new Map();
  for (const e of input) {
    const base = stripTypePrefix(e.name) || e.name;
    const key = `${e.country}|${e.city}|${e.type}|${normalize(base)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(e);
  }

  const entities = [];
  for (const group of buckets.values()) {
    if (group.length === 1) {
      entities.push(buildEntity(group));
      continue;
    }

    const components = [];
    const used = new Set();
    const radius = MERGE_RADIUS_M[group[0].type] ?? 800;
    for (let i = 0; i < group.length; i++) {
      if (used.has(i)) continue;
      const stack = [i];
      used.add(i);
      const idxs = [];
      while (stack.length) {
        const a = stack.pop();
        idxs.push(a);
        for (let j = 0; j < group.length; j++) {
          if (used.has(j)) continue;
          if (radius === Infinity || haversineM(group[a], group[j]) <= radius) {
            used.add(j);
            stack.push(j);
          }
        }
      }
      components.push(idxs.map((idx) => group[idx]));
    }

    if (components.length === 1) {
      entities.push(buildEntity(components[0]));
    } else {
      const allNames = [...new Set(group.map((e) => cleanText(e.name)))];
      for (const component of components) {
        const nearestOther = Math.min(...components
          .filter((c) => c !== component)
          .flatMap((c) => component.flatMap((a) => c.map((b) => haversineM(a,b)))));
        entities.push(buildEntity(component, {
          reason: 'same_canonical_name_far_apart',
          observedNames: allNames,
          nearestConflictingDistanceM: Math.round(nearestOther),
          note: 'Kept as a separate review candidate; do not auto-merge without external verification.',
        }));
      }
    }
  }

  entities.sort((a,b) => a.country.localeCompare(b.country)
    || a.city.localeCompare(b.city)
    || a.type.localeCompare(b.type)
    || a.canonical.slug.localeCompare(b.canonical.slug));

  const rejected = [];
  if (rejectedPath) {
    const text = await readFile(rejectedPath, 'utf8');
    let n = 0;
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const row = JSON.parse(line);
      n += 1;
      rejected.push({
        rejectionId: `raw-reject-${String(n).padStart(5, '0')}`,
        country: row.country ?? null,
        city: row.city ?? null,
        provider: row.provider ?? null,
        requestedType: row.requestedType ?? null,
        name: row.name ?? null,
        objectUrl: row.objectUrl ?? null,
        reason: parseRejectReason(row.reason),
      });
    }
  }

  const countBy = (items, fn) => Object.fromEntries([...items.reduce((m,x) => {
    const k = String(fn(x)); m.set(k, (m.get(k) || 0) + 1); return m;
  }, new Map()).entries()].sort((a,b) => a[0].localeCompare(b[0])));

  const accepted = entities.filter((e) => e.status === 'accepted');
  const review = entities.filter((e) => e.status === 'review');
  const postCleanRejected = entities.filter((e) => e.status === 'rejected');

  const output = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    purpose: 'Canonical staging dataset for deterministic geo-catalog and parsing-lexicon synchronization.',
    rules: {
      coordinatesRequired: true,
      zeroCoordinatesRejected: true,
      genericNamesRejected: true,
      sameNameMergeRadiusM: MERGE_RADIUS_M,
      translationsAreNeverInvented: true,
      unresolvedTranslationsAreMarkedPending: true,
      repoResolutionIsPendingUntilMatchedAgainstCurrentDevelop: true,
    },
    source: {
      file: path.basename(cleanPath),
      cleanerCounts: clean.counts ?? null,
    },
    counts: {
      sourceMergedEntities: input.length,
      canonicalEntities: entities.length,
      mergedCanonicalDuplicates: input.length - entities.length,
      accepted: accepted.length,
      review: review.length,
      postCleanRejected: postCleanRejected.length,
      originalRejectedRows: rejected.length,
      byCountry: countBy(entities, (e) => e.country),
      byType: countBy(entities, (e) => e.type),
      byStatus: countBy(entities, (e) => e.status),
    },
    entities,
    rejectedRaw: rejected,
  };

  const keys = entities.map((e) => e.entityKey);
  if (new Set(keys).size !== keys.length) throw new Error('Canonical entityKey collision detected');
  if (accepted.some((e) => !validPoint(e.location.lat, e.location.lng))) throw new Error('Accepted entity has invalid coordinates');

  await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(output.counts, null, 2));
  console.log(`Wrote ${outPath}`);
}

await main();
