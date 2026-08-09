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

export interface ServiceSeed {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  offerType: OfferType;
  summary: string;
  monetaryCapUsd?: number | null;
  userSeatLimit?: number | null;
  verification: VerificationReq[];
  directPortalUrl: string;
  alternativeToUrl?: string | null;
  metaResource: boolean;
  featured?: boolean;
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
    summary:
      "Google Workspace for Nonprofits ($0/user) and up to $10,000/mo in Google Ad Grants.",
    monetaryCapUsd: null,
    userSeatLimit: null,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-workspace/",
    metaResource: false,
    featured: true,
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
    summary:
      "Microsoft 365 Business Premium (up to 10 free seats) and about $2,000 annual Azure credits.",
    monetaryCapUsd: 2000,
    userSeatLimit: 10,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://nonprofit.microsoft.com/",
    alternativeToUrl: "https://alternativeto.net/software/microsoft-365/",
    metaResource: false,
    featured: true,
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
    summary:
      "Free GitHub Team with unlimited private repos; discounts on Enterprise Cloud.",
    verification: ["501c3_letter"],
    directPortalUrl: "https://github.com/solutions/industry/nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/github/",
    metaResource: false,
    featured: true,
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
    summary: "Free Canva Pro for up to 10 team members.",
    userSeatLimit: 10,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.canva.com/canva-for-nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/canva/",
    metaResource: false,
    featured: true,
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
    summary:
      "Upgraded Pro plan for teams under 250 members; deep discounts on Enterprise.",
    userSeatLimit: 250,
    verification: ["501c3_letter"],
    directPortalUrl: "https://slack.com/for-nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/slack/",
    metaResource: false,
    featured: true,
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
    summary:
      "Promotional credits via AWS Imagine Grant / Tech Alliance (often $1k–$5k/year).",
    monetaryCapUsd: 5000,
    verification: ["501c3_letter"],
    directPortalUrl: "https://aws.amazon.com/government-education/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/amazon-web-services/",
    metaResource: false,
    featured: true,
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
    summary:
      "Direct hardware and software license requests (Microsoft, Adobe, Intuit, and more).",
    verification: ["techsoup_token", "501c3_letter"],
    directPortalUrl: "https://www.techsoup.org/get-product-donations",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "techsoup-software",
    slug: "techsoup-nonprofit-software",
    name: "TechSoup Nonprofit Software Directory",
    category: "meta_directory",
    offerType: "meta_directory",
    summary: "Software directory sorted by category for verified nonprofits.",
    verification: ["techsoup_token"],
    directPortalUrl: "https://www.techsoup.org/nonprofit-software",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "pcs-for-people",
    slug: "pcs-for-people",
    name: "PCs for People",
    category: "hardware",
    offerType: "tier_discount",
    summary:
      "Refurbished enterprise desktops, laptops, and networking for verified 501(c)(3)s.",
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.pcsforpeople.org/tech-for-nonprofits/",
    metaResource: false,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "awesome-free-nonprofits",
    slug: "awesome-free-nonprofits",
    name: "awesome-free-nonprofits",
    category: "meta_directory",
    offerType: "meta_directory",
    summary:
      "Community-maintained GitHub directory of free and discounted nonprofit tiers.",
    verification: ["none"],
    directPortalUrl: "https://github.com/athman3/awesome-free-nonprofits",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "awesome-nonprofit",
    slug: "awesome-nonprofit",
    name: "awesome-nonprofit",
    category: "meta_directory",
    offerType: "meta_directory",
    summary:
      "Structured list of vendor discount percentages and qualification steps.",
    verification: ["none"],
    directPortalUrl: "https://github.com/tresni/awesome-nonprofit",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "alternativeto",
    slug: "alternativeto",
    name: "AlternativeTo",
    category: "meta_directory",
    offerType: "meta_directory",
    summary:
      "Find free and open-source alternatives; often surfaces nonprofit pricing in comments.",
    verification: ["none"],
    directPortalUrl: "https://alternativeto.net/",
    metaResource: true,
    featured: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "whole-whale",
    slug: "whole-whale",
    name: "Whole Whale Resources",
    category: "meta_directory",
    offerType: "meta_directory",
    summary: "Categorized roundups of nonprofit tools and direct application links.",
    verification: ["none"],
    directPortalUrl: "https://www.wholewhale.com/resources/",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "ntp-tech-for-good",
    slug: "nonprofit-tech-for-good",
    name: "Nonprofit Tech for Good",
    category: "meta_directory",
    offerType: "meta_directory",
    summary: "Vendor lists, reviews, and software discounts for nonprofit teams.",
    verification: ["none"],
    directPortalUrl: "https://www.nptechforgood.com/",
    metaResource: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "devcentr",
    slug: "devcentr",
    name: "DevCentr",
    category: "partner_oss",
    offerType: "diy_oss",
    summary: "Open developer tooling, docs hub, and standards from the DevCentr org.",
    verification: ["none"],
    directPortalUrl: "https://devcentr.org/",
    metaResource: false,
    featured: true,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "openshellorg",
    slug: "openshellorg",
    name: "OpenShellOrg",
    category: "partner_oss",
    offerType: "diy_oss",
    summary: "Open shell / systems projects and documentation.",
    verification: ["none"],
    directPortalUrl: "https://openshellorg.github.io/",
    metaResource: false,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "linx-photos",
    slug: "linx-photos",
    name: "linx.photos",
    category: "partner_oss",
    offerType: "diy_oss",
    summary: "Photo and media tooling from LinxPhotos — free/open options for creators.",
    verification: ["none"],
    directPortalUrl: "https://linx.photos/",
    metaResource: false,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "instalay",
    slug: "instalay",
    name: "InstaLay",
    category: "partner_oss",
    offerType: "diy_oss",
    summary: "Open-source layout tool under LinxPhotos.",
    verification: ["none"],
    directPortalUrl: "https://github.com/LinxPhotos/InstaLay",
    metaResource: false,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
  {
    id: "hci-nerdz",
    slug: "hci-nerdz",
    name: "HCI Nerdz",
    category: "partner_oss",
    offerType: "diy_oss",
    summary: "Human–computer interaction essays, standards, and open docs.",
    verification: ["none"],
    directPortalUrl: "https://hci-nerdz.github.io/",
    metaResource: false,
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
];

export function getServiceBySlug(slug: string) {
  return servicesSeed.find((s) => s.slug === slug);
}

export function bypassesGatekeepers(s: ServiceSeed) {
  return s.verification.every(
    (v) => v === "none" || v === "ein_only" || v === "501c3_letter" || v === "work_email_only",
  );
}
