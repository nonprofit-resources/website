import { ossFundSeedMeta } from "./oss-fund-seed.generated";
import { isOpenSourceGeared, serviceHref, servicesSeed, type ServiceSeed } from "./services-seed";
import { SITE_URL } from "./utils";

export function catalogItemDto(s: ServiceSeed) {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    href: `${SITE_URL}${serviceHref(s)}`,
    category: s.category,
    offerType: s.offerType,
    resourceKind: s.resourceKind,
    summary: s.summary,
    absolutelyFree: s.absolutelyFree,
    intermediaryRequired: s.intermediaryRequired,
    verification: s.verification,
    tags: s.tags,
    portalUrl: s.directPortalUrl,
    metaResource: s.metaResource,
    featured: Boolean(s.featured),
    lastVerifiedAt: s.lastVerifiedAt,
    stalenessStatus: s.stalenessStatus,
    listingKind: s.listingKind ?? "standalone",
    parentId: s.parentId ?? null,
    openSource: isOpenSourceGeared(s),
  };
}

export function catalogFeed() {
  return {
    version: 1,
    catalog: "nonprofit-resources",
    home: SITE_URL,
    license: "Catalog JSON is provided so sibling directories can stay in sync. OSS.Fund listings are CC BY 4.0 (attr: OSS.Fund).",
    webhooks: `${SITE_URL}/api/webhooks`,
    items: servicesSeed.map(catalogItemDto),
    ossFund: {
      ...ossFundSeedMeta,
      listing: `${SITE_URL}/services/oss-fund`,
    },
    generatedAt: new Date().toISOString(),
    count: servicesSeed.length,
  };
}
