import type {
  CategoryId,
  ListingKind,
  OfferType,
  ResourceKind,
  ServiceSeed,
  StalenessStatus,
} from "./services-seed";
import {
  bypassesGatekeepers,
  isOpenSourceGeared,
  listingKindOf,
  serviceSearchBlob,
} from "./services-seed";

export type SortKey = "relevance" | "name_asc" | "name_desc" | "verified_desc" | "featured";

export interface CatalogFilterState {
  query: string;
  absolutelyFree: boolean;
  bypassGatekeepers: boolean;
  noVerification: boolean;
  featuredOnly: boolean;
  openSource: boolean;
  excludeMeta: boolean;
  categories: CategoryId[];
  offerTypes: OfferType[];
  resourceKinds: ResourceKind[];
  listingKinds: ListingKind[];
  staleness: StalenessStatus[];
  sort: SortKey;
}

export const defaultCatalogFilters = (): CatalogFilterState => ({
  query: "",
  absolutelyFree: false,
  bypassGatekeepers: false,
  noVerification: false,
  featuredOnly: false,
  openSource: false,
  excludeMeta: false,
  categories: [],
  offerTypes: [],
  resourceKinds: [],
  listingKinds: [],
  staleness: [],
  sort: "relevance",
});

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[\s,/|+]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export function scoreService(s: ServiceSeed, tokens: string[]) {
  if (tokens.length === 0) return 0;
  const blob = serviceSearchBlob(s);
  const name = s.name.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (name === t) score += 12;
    else if (name.startsWith(t)) score += 8;
    else if (name.includes(t)) score += 5;
    if (s.tags.some((tag) => tag === t || tag.includes(t))) score += 4;
    if (blob.includes(t)) score += 2;
    else return -1;
  }
  if (s.featured) score += 1;
  if (s.absolutelyFree) score += 0.5;
  return score;
}

export function applyCatalogFilters(services: ServiceSeed[], filters: CatalogFilterState) {
  const tokens = tokenize(filters.query);
  let rows = services.filter((s) => {
    if (filters.absolutelyFree && !s.absolutelyFree) return false;
    if (filters.bypassGatekeepers && !bypassesGatekeepers(s)) return false;
    if (filters.noVerification && !s.verification.every((v) => v === "none")) return false;
    if (filters.featuredOnly && !s.featured) return false;
    if (filters.openSource && !isOpenSourceGeared(s)) return false;
    if (filters.excludeMeta && s.metaResource) return false;
    if (filters.categories.length && !filters.categories.includes(s.category)) return false;
    if (filters.offerTypes.length && !filters.offerTypes.includes(s.offerType)) return false;
    if (filters.resourceKinds.length && !filters.resourceKinds.includes(s.resourceKind))
      return false;
    if (filters.listingKinds.length && !filters.listingKinds.includes(listingKindOf(s)))
      return false;
    if (filters.staleness.length && !filters.staleness.includes(s.stalenessStatus)) return false;
    if (tokens.length) {
      if (scoreService(s, tokens) < 0) return false;
    }
    return true;
  });

  const sort = filters.sort;
  rows = [...rows].sort((a, b) => {
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    if (sort === "name_desc") return b.name.localeCompare(a.name);
    if (sort === "verified_desc") return b.lastVerifiedAt.localeCompare(a.lastVerifiedAt);
    if (sort === "featured") {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return a.name.localeCompare(b.name);
    }
    // relevance
    if (tokens.length) {
      const d = scoreService(b, tokens) - scoreService(a, tokens);
      if (d !== 0) return d;
    }
    const fa = a.featured ? 1 : 0;
    const fb = b.featured ? 1 : 0;
    if (fa !== fb) return fb - fa;
    return a.name.localeCompare(b.name);
  });

  return rows;
}

export function countActiveFilters(f: CatalogFilterState) {
  let n = 0;
  if (f.query.trim()) n++;
  if (f.absolutelyFree) n++;
  if (f.bypassGatekeepers) n++;
  if (f.noVerification) n++;
  if (f.featuredOnly) n++;
  if (f.openSource) n++;
  if (f.excludeMeta) n++;
  n += f.categories.length;
  n += f.offerTypes.length;
  n += f.resourceKinds.length;
  n += f.listingKinds.length;
  n += f.staleness.length;
  if (f.sort !== "relevance") n++;
  return n;
}

export function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

/** Parse / serialize shareable filter query params. */
export function filtersFromSearchParams(params: URLSearchParams): CatalogFilterState {
  const base = defaultCatalogFilters();
  const csv = (key: string) =>
    (params.get(key) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  base.query = params.get("q") ?? "";
  base.absolutelyFree = params.get("free") === "1";
  base.bypassGatekeepers = params.get("bypass") === "1";
  base.noVerification = params.get("noverif") === "1";
  base.featuredOnly = params.get("featured") === "1";
  base.openSource = params.get("oss") === "1";
  base.excludeMeta = params.get("nometa") === "1";
  base.categories = csv("cat") as CategoryId[];
  base.offerTypes = csv("offer") as OfferType[];
  base.resourceKinds = csv("kind") as ResourceKind[];
  base.listingKinds = csv("list") as ListingKind[];
  base.staleness = csv("status") as StalenessStatus[];
  const sort = params.get("sort") as SortKey | null;
  if (sort) base.sort = sort;
  return base;
}

export function filtersToSearchParams(f: CatalogFilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.query.trim()) p.set("q", f.query.trim());
  if (f.absolutelyFree) p.set("free", "1");
  if (f.bypassGatekeepers) p.set("bypass", "1");
  if (f.noVerification) p.set("noverif", "1");
  if (f.featuredOnly) p.set("featured", "1");
  if (f.openSource) p.set("oss", "1");
  if (f.excludeMeta) p.set("nometa", "1");
  if (f.categories.length) p.set("cat", f.categories.join(","));
  if (f.offerTypes.length) p.set("offer", f.offerTypes.join(","));
  if (f.resourceKinds.length) p.set("kind", f.resourceKinds.join(","));
  if (f.listingKinds.length) p.set("list", f.listingKinds.join(","));
  if (f.staleness.length) p.set("status", f.staleness.join(","));
  if (f.sort !== "relevance") p.set("sort", f.sort);
  return p;
}
