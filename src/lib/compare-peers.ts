import { scoreService } from "./catalog-filters";
import {
  CATEGORY_LABELS,
  listingKindOf,
  servicesSeed,
  type ServiceSeed,
} from "./services-seed";

/** Programs compare with programs; apps and standalones are product-level peers. */
export function compareLane(s: ServiceSeed): "program" | "product" {
  return listingKindOf(s) === "program" ? "program" : "product";
}

export function compareCompatible(anchor: ServiceSeed, candidate: ServiceSeed) {
  if (anchor.id === candidate.id) return false;
  return anchor.category === candidate.category && compareLane(anchor) === compareLane(candidate);
}

export function compareLaneLabel(anchor: ServiceSeed) {
  const lane = compareLane(anchor) === "program" ? "programs" : "apps";
  return `${CATEGORY_LABELS[anchor.category]} ${lane}`;
}

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[\s,/|+]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** Ranked catalog hits for the compare picker. Empty query lists featured / name-sorted peers. */
export function compareSearchHits(
  query: string,
  opts: { excludeIds: string[]; anchor?: ServiceSeed; limit?: number },
) {
  const exclude = new Set(opts.excludeIds);
  const tokens = tokenize(query);
  const pool = servicesSeed.filter((s) => {
    if (exclude.has(s.id)) return false;
    if (opts.anchor && !compareCompatible(opts.anchor, s)) return false;
    return true;
  });
  return pool
    .map((s) => {
      if (tokens.length === 0) return { s, score: (s.featured ? 4 : 0) + (s.name.length > 0 ? 1 : 0) };
      return { s, score: scoreService(s, tokens) };
    })
    .filter((row) => row.score >= 0)
    .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name))
    .slice(0, opts.limit ?? 24)
    .map((row) => row.s);
}
