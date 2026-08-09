export type OfferType =
  | "100_percent_free"
  | "tier_discount"
  | "grant_credit"
  | "freemium_upgrade"
  | "diy_oss"
  | "meta_directory";

export type CategoryId =
  | "cloud_hosting"
  | "crm"
  | "design"
  | "dev_tools"
  | "meta_directory"
  | "hardware"
  | "ai_llm"
  | "productivity"
  | "security"
  | "marketing"
  | "partner_oss";

export type VerificationReq =
  | "501c3_letter"
  | "techsoup_token"
  | "goodstack_token"
  | "ein_only"
  | "work_email_only"
  | "none";

export type StalenessStatus = "active" | "unverified" | "deprecated";

/** How the listing fits the catalog taxonomy. */
export type ResourceKind = "vendor_plan" | "diy_oss" | "meta_directory" | "hardware";

export interface ServiceSeed {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  offerType: OfferType;
  resourceKind: ResourceKind;
  summary: string;
  /** Zero cash outlay for the core nonprofit / OSS offer (after any free eligibility check). */
  absolutelyFree: boolean;
  /** True when TechSoup / Goodstack (or similar) token is required. */
  intermediaryRequired: boolean;
  monetaryCapUsd?: number | null;
  userSeatLimit?: number | null;
  verification: VerificationReq[];
  directPortalUrl: string;
  alternativeToUrl?: string | null;
  metaResource: boolean;
  featured?: boolean;
  tags: string[];
  iconHint?: string;
  screenshotUrl?: string;
  lastVerifiedAt: string;
  stalenessStatus: StalenessStatus;
}

export const servicesSeed: ServiceSeed[] = [
  {
    id: "google-nonprofits",
    slug: "google-for-nonprofits",
    name: "Google for Nonprofits",
    category: "productivity",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    summary:
      "Google Workspace for Nonprofits ($0/user) and up to $10,000/mo in Google Ad Grants.",
    absolutelyFree: true,
    intermediaryRequired: false,
    monetaryCapUsd: null,
    userSeatLimit: null,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-workspace/",
    metaResource: false,
    featured: true,
    tags: ["workspace", "email", "ad-grants", "google"],
    iconHint: "google",
    screenshotUrl: "https://www.google.com/nonprofits/",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "microsoft-nonprofits",
    slug: "microsoft-for-nonprofits",
    name: "Microsoft for Nonprofits",
    category: "productivity",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    summary:
      "Microsoft 365 Business Premium (up to 10 free seats) and about $2,000 annual Azure credits.",
    absolutelyFree: true,
    intermediaryRequired: true,
    monetaryCapUsd: 2000,
    userSeatLimit: 10,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://nonprofit.microsoft.com/",
    alternativeToUrl: "https://alternativeto.net/software/microsoft-365/",
    metaResource: false,
    featured: true,
    tags: ["m365", "azure", "office", "microsoft"],
    iconHint: "microsoft",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "github-nonprofits",
    slug: "github-for-nonprofits",
    name: "GitHub for Nonprofits",
    category: "dev_tools",
    offerType: "tier_discount",
    resourceKind: "vendor_plan",
    summary:
      "Free GitHub Team with unlimited private repos; discounts on Enterprise Cloud.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://github.com/solutions/industry/nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/github/",
    metaResource: false,
    featured: true,
    tags: ["git", "devtools", "ci", "github"],
    iconHint: "github",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "canva-nonprofits",
    slug: "canva-for-nonprofits",
    name: "Canva for Nonprofits",
    category: "design",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    summary: "Free Canva Pro for up to 10 team members.",
    absolutelyFree: true,
    intermediaryRequired: false,
    userSeatLimit: 10,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.canva.com/canva-for-nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/canva/",
    metaResource: false,
    featured: true,
    tags: ["design", "graphics", "canva"],
    iconHint: "canva",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "slack-nonprofits",
    slug: "slack-for-nonprofits",
    name: "Slack for Nonprofits",
    category: "productivity",
    offerType: "freemium_upgrade",
    resourceKind: "vendor_plan",
    summary:
      "Upgraded Pro plan for teams under 250 members; deep discounts on Enterprise.",
    absolutelyFree: true,
    intermediaryRequired: false,
    userSeatLimit: 250,
    verification: ["501c3_letter"],
    directPortalUrl: "https://slack.com/for-nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/slack/",
    metaResource: false,
    featured: true,
    tags: ["chat", "collaboration", "slack"],
    iconHint: "slack",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "aws-nonprofits",
    slug: "aws-for-nonprofits",
    name: "AWS for Nonprofits",
    category: "cloud_hosting",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    summary:
      "Promotional credits via AWS Imagine Grant / Tech Alliance (often $1k–$5k/year).",
    absolutelyFree: false,
    intermediaryRequired: false,
    monetaryCapUsd: 5000,
    verification: ["501c3_letter"],
    directPortalUrl: "https://aws.amazon.com/government-education/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/amazon-web-services/",
    metaResource: false,
    featured: true,
    tags: ["cloud", "credits", "aws", "hosting"],
    iconHint: "aws",
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "techsoup-donations",
    slug: "techsoup-product-donations",
    name: "TechSoup Product Donations",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary:
      "Direct hardware and software license requests (Microsoft, Adobe, Intuit, and more).",
    absolutelyFree: false,
    intermediaryRequired: true,
    verification: ["techsoup_token", "501c3_letter"],
    directPortalUrl: "https://www.techsoup.org/get-product-donations",
    metaResource: true,
    tags: ["techsoup", "donations", "licenses"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "techsoup-software",
    slug: "techsoup-nonprofit-software",
    name: "TechSoup Nonprofit Software Directory",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary: "Software directory sorted by category for verified nonprofits.",
    absolutelyFree: false,
    intermediaryRequired: true,
    verification: ["techsoup_token"],
    directPortalUrl: "https://www.techsoup.org/nonprofit-software",
    metaResource: true,
    tags: ["techsoup", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "pcs-for-people",
    slug: "pcs-for-people",
    name: "PCs for People",
    category: "hardware",
    offerType: "tier_discount",
    resourceKind: "hardware",
    summary:
      "Refurbished enterprise desktops, laptops, and networking for verified 501(c)(3)s.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.pcsforpeople.org/tech-for-nonprofits/",
    metaResource: false,
    tags: ["hardware", "refurbished", "laptops"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "awesome-free-nonprofits",
    slug: "awesome-free-nonprofits",
    name: "awesome-free-nonprofits",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary:
      "Community-maintained GitHub directory of free and discounted nonprofit tiers.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://github.com/athman3/awesome-free-nonprofits",
    metaResource: true,
    tags: ["awesome-list", "github", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "awesome-nonprofit",
    slug: "awesome-nonprofit",
    name: "awesome-nonprofit",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary:
      "Structured list of vendor discount percentages and qualification steps.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://github.com/tresni/awesome-nonprofit",
    metaResource: true,
    tags: ["awesome-list", "github", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "alternativeto",
    slug: "alternativeto",
    name: "AlternativeTo",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary:
      "Find free and open-source alternatives; often surfaces nonprofit pricing in comments.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://alternativeto.net/",
    metaResource: true,
    featured: true,
    tags: ["alternatives", "foss", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "whole-whale",
    slug: "whole-whale",
    name: "Whole Whale Resources",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary: "Categorized roundups of nonprofit tools and direct application links.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://www.wholewhale.com/resources/",
    metaResource: true,
    tags: ["guides", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "ntp-tech-for-good",
    slug: "nonprofit-tech-for-good",
    name: "Nonprofit Tech for Good",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary: "Vendor lists, reviews, and software discounts for nonprofit teams.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://www.nptechforgood.com/",
    metaResource: true,
    tags: ["reviews", "directory"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "devcentr",
    slug: "devcentr",
    name: "DevCentr",
    category: "partner_oss",
    offerType: "diy_oss",
    resourceKind: "diy_oss",
    summary: "Open developer tooling, docs hub, and standards from the DevCentr org.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://devcentr.org/",
    metaResource: false,
    featured: true,
    tags: ["oss", "devtools", "docs"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "openshellorg",
    slug: "openshellorg",
    name: "OpenShellOrg",
    category: "partner_oss",
    offerType: "diy_oss",
    resourceKind: "diy_oss",
    summary: "Open shell / systems projects and documentation.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://openshellorg.github.io/",
    metaResource: false,
    tags: ["oss", "systems"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "linx-photos",
    slug: "linx-photos",
    name: "linx.photos",
    category: "partner_oss",
    offerType: "diy_oss",
    resourceKind: "diy_oss",
    summary: "Photo and media tooling from LinxPhotos — free/open options for creators.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://linx.photos/",
    metaResource: false,
    tags: ["oss", "photos", "media"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "instalay",
    slug: "instalay",
    name: "InstaLay",
    category: "partner_oss",
    offerType: "diy_oss",
    resourceKind: "diy_oss",
    summary: "Open-source layout tool under LinxPhotos.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://github.com/LinxPhotos/InstaLay",
    metaResource: false,
    tags: ["oss", "layout"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "hci-nerdz",
    slug: "hci-nerdz",
    name: "HCI Nerdz",
    category: "partner_oss",
    offerType: "diy_oss",
    resourceKind: "diy_oss",
    summary: "Human–computer interaction essays, standards, and open docs.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://hci-nerdz.github.io/",
    metaResource: false,
    tags: ["oss", "hci", "docs"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
];

export function getServiceBySlug(slug: string) {
  return servicesSeed.find((s) => s.slug === slug);
}

export function bypassesGatekeepers(s: ServiceSeed) {
  return !s.intermediaryRequired;
}

export function serviceSearchBlob(s: ServiceSeed) {
  return [s.name, s.summary, s.category, s.offerType, s.resourceKind, ...s.tags]
    .join(" ")
    .toLowerCase();
}

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  "100_percent_free": "100% free plan",
  tier_discount: "Tier discount",
  grant_credit: "Grant / credits",
  freemium_upgrade: "Free upgrade",
  diy_oss: "DIY / open source",
  meta_directory: "Meta directory",
};

export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  vendor_plan: "Vendor nonprofit plan",
  diy_oss: "DIY / open source",
  meta_directory: "Meta directory",
  hardware: "Hardware",
};

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  cloud_hosting: "Cloud hosting",
  crm: "CRM",
  design: "Design",
  dev_tools: "Dev tools",
  meta_directory: "Meta directory",
  hardware: "Hardware",
  ai_llm: "AI / LLM",
  productivity: "Productivity",
  security: "Security",
  marketing: "Marketing",
  partner_oss: "Partner OSS",
};
