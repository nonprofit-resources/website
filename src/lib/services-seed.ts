import type { CompareValues } from "./compare-features";
import { ossFundSeed } from "./oss-fund-seed.generated";

export type OfferType =
  | "100_percent_free"
  | "tier_discount"
  | "grant_credit"
  | "freemium_upgrade"
  | "trial_then_paid"
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
  | "open_source"
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

/** Program = vendor umbrella; app = product inside a program; standalone = own listing. */
export type ListingKind = "program" | "app" | "standalone";

export type { CompareValues };

export interface ServiceSeed {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  offerType: OfferType;
  resourceKind: ResourceKind;
  summary: string;
  /** Longer copy for the entity / app page. */
  details?: string;
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
  listingKind?: ListingKind;
  /** Parent program id when this row is a platform app. */
  parentId?: string;
  compare?: CompareValues;
}

/** Hand-authored first-party listings. OSS.Fund imports are merged after this array. */
const handServicesSeed: ServiceSeed[] = [
  {
    id: "google-nonprofits",
    slug: "google-for-nonprofits",
    name: "Google for Nonprofits",
    category: "productivity",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    listingKind: "program",
    summary:
      "Eligibility portal for Google’s nonprofit product suite. After verification, activate Workspace, Ad Grants, YouTube, and Maps separately.",
    details:
      "Google for Nonprofits is the verification gate, not a single app. Eligible orgs in 180+ geographies request an account, then turn on each product from the portal. Individual apps in this catalog have their own limits, activation steps, and comparison rows.",
    absolutelyFree: true,
    intermediaryRequired: false,
    monetaryCapUsd: null,
    userSeatLimit: null,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-workspace/",
    metaResource: false,
    featured: true,
    tags: ["google", "program", "workspace", "ad-grants", "youtube", "maps"],
    iconHint: "google",
    screenshotUrl: "https://www.google.com/nonprofits/",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      intermediary: false,
      verification: "501(c)(3) letter",
      notes: "Activate each product separately after portal approval.",
    },
  },
  {
    id: "google-workspace-nonprofits",
    slug: "google-workspace",
    name: "Google Workspace for Nonprofits",
    category: "productivity",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "google-nonprofits",
    summary:
      "No-cost Workspace for up to 2,000 users: Gmail, Drive, Meet, Calendar, plus Gemini and NotebookLM.",
    details:
      "Included with an approved Google for Nonprofits account. The no-cost plan covers collaboration (Gmail, Calendar, Drive, Meet, sites) for up to 2,000 employees or volunteers, with Gemini and NotebookLM listed as core AI services. Discounted Business Standard, Business Plus, and Enterprise editions exist if you outgrow the free SKU. Activate Workspace from the Google for Nonprofits portal — it is a separate switch from Ad Grants or YouTube.",
    absolutelyFree: true,
    intermediaryRequired: false,
    userSeatLimit: 2000,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-workspace/",
    metaResource: false,
    tags: ["google", "workspace", "gmail", "drive", "meet", "gemini", "notebooklm"],
    iconHint: "google-workspace",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      seatLimit: 2000,
      intermediary: false,
      verification: "501(c)(3) via Google for Nonprofits",
      email: true,
      docs: true,
      ai: true,
      notes: "Discounted paid SKUs available; AI & Productivity 1:1 help is a separate add-on program.",
    },
  },
  {
    id: "google-ad-grants",
    slug: "google-ad-grants",
    name: "Google Ad Grants",
    category: "marketing",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "google-nonprofits",
    summary: "Up to $10,000 USD per month in in-kind Search ads; Performance Max can place ads on Google Maps.",
    details:
      "Ad Grants is in-kind advertising credit, not cash. After Google for Nonprofits verification, activate Ad Grants separately and maintain policy-compliant campaigns. Text ads run on Google Search; Performance Max campaigns can also appear on eligible Maps placements. This is independent of Workspace — you can use ads without moving email to Google.",
    absolutelyFree: true,
    intermediaryRequired: false,
    monetaryCapUsd: 10000,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-ads/",
    metaResource: false,
    tags: ["google", "ads", "ad-grants", "search", "maps"],
    iconHint: "google-ad-grants",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      monetaryCapUsd: 10000,
      intermediary: false,
      verification: "501(c)(3) via Google for Nonprofits",
      ads: true,
      maps: true,
      notes: "In-kind Search inventory ($10k/mo). Must stay within Ad Grants policies.",
    },
  },
  {
    id: "youtube-nonprofit",
    slug: "youtube-nonprofit-program",
    name: "YouTube Nonprofit Program",
    category: "marketing",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "google-nonprofits",
    summary: "YouTube features for fundraising and storytelling after Google for Nonprofits verification.",
    details:
      "The YouTube Nonprofit Program is activated from the Google for Nonprofits portal, separately from Workspace and Ad Grants. It is aimed at connecting with supporters through video (donate features and cause storytelling on the YouTube platform). Confirm current donate-on-YouTube availability for your country when you activate.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/youtube/",
    metaResource: false,
    tags: ["google", "youtube", "video", "fundraising"],
    iconHint: "youtube",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      intermediary: false,
      verification: "501(c)(3) via Google for Nonprofits",
      video: true,
      notes: "Activate in the Google for Nonprofits product list; country donate features vary.",
    },
  },
  {
    id: "google-maps-platform-nonprofits",
    slug: "google-maps-platform",
    name: "Google Maps Platform credits",
    category: "cloud_hosting",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "google-nonprofits",
    summary: "Monthly Maps Platform credits for mapping, places, and location visualizations.",
    details:
      "Maps Platform credits are another separate activation on a Google for Nonprofits account. Use them for community maps, program locators, and impact visualizations rather than consumer Google Maps. Credit amounts are set by Google and can change — treat the listed cap as last-verified, not a contract.",
    absolutelyFree: true,
    intermediaryRequired: false,
    monetaryCapUsd: 250,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.google.com/nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/google-maps/",
    metaResource: false,
    tags: ["google", "maps", "credits", "location"],
    iconHint: "google-maps",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      monetaryCapUsd: 250,
      intermediary: false,
      verification: "501(c)(3) via Google for Nonprofits",
      maps: true,
      cloud: true,
      notes: "$250/mo last verified; confirm current credit in the Maps Platform console.",
    },
  },
  {
    id: "microsoft-nonprofits",
    slug: "microsoft-for-nonprofits",
    name: "Microsoft for Nonprofits",
    category: "productivity",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    listingKind: "program",
    summary:
      "Microsoft’s nonprofit eligibility hub for Microsoft 365, Azure credits, and related product grants.",
    details:
      "Microsoft for Nonprofits is the program umbrella. Individual products (Microsoft 365 seats, Azure credits) have their own caps and often require a TechSoup validation token in addition to 501(c)(3) proof. GitHub for Nonprofits is listed separately in this catalog.",
    absolutelyFree: true,
    intermediaryRequired: true,
    monetaryCapUsd: 2000,
    userSeatLimit: 10,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://nonprofit.microsoft.com/",
    alternativeToUrl: "https://alternativeto.net/software/microsoft-365/",
    metaResource: false,
    featured: true,
    tags: ["microsoft", "program", "m365", "azure"],
    iconHint: "microsoft",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      intermediary: true,
      verification: "501(c)(3) + TechSoup token",
      notes: "Products below are activated individually after eligibility.",
    },
  },
  {
    id: "microsoft-365-nonprofits",
    slug: "microsoft-365",
    name: "Microsoft 365 Business Premium (nonprofit)",
    category: "productivity",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "microsoft-nonprofits",
    summary: "Up to 10 no-cost Business Premium seats for eligible nonprofits (TechSoup token).",
    details:
      "The headline Microsoft 365 grant is a small number of Business Premium seats (commonly 10), not unlimited tenant-wide licenses. Additional seats are discounted rather than free. Eligibility typically goes through Microsoft for Nonprofits plus a TechSoup (or equivalent) token. This is the email/docs/desktop suite counterpart to Google Workspace.",
    absolutelyFree: true,
    intermediaryRequired: true,
    userSeatLimit: 10,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://nonprofit.microsoft.com/",
    alternativeToUrl: "https://alternativeto.net/software/microsoft-365/",
    metaResource: false,
    tags: ["microsoft", "m365", "office", "email", "teams"],
    iconHint: "microsoft-365",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      seatLimit: 10,
      intermediary: true,
      verification: "501(c)(3) + TechSoup",
      email: true,
      docs: true,
      notes: "Further seats are discounted, not unlimited free.",
    },
  },
  {
    id: "microsoft-azure-credits",
    slug: "microsoft-azure-credits",
    name: "Azure credits for nonprofits",
    category: "cloud_hosting",
    offerType: "grant_credit",
    resourceKind: "vendor_plan",
    listingKind: "app",
    parentId: "microsoft-nonprofits",
    summary: "About $2,000 annual Azure credits for eligible nonprofits after Microsoft eligibility.",
    details:
      "Azure nonprofit credits are a separate product from Microsoft 365 seats. The commonly cited grant is about $2,000 USD per year — confirm the current amount in the Microsoft nonprofit portal because credit SKUs change. Use this row when comparing cloud compute grants (versus AWS or Google Cloud offers).",
    absolutelyFree: true,
    intermediaryRequired: true,
    monetaryCapUsd: 2000,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://nonprofit.microsoft.com/",
    alternativeToUrl: "https://alternativeto.net/software/windows-azure/",
    metaResource: false,
    tags: ["microsoft", "azure", "cloud", "credits"],
    iconHint: "microsoft-azure",
    lastVerifiedAt: "2026-08-15",
    stalenessStatus: "active",
    compare: {
      freeCore: true,
      monetaryCapUsd: 2000,
      intermediary: true,
      verification: "501(c)(3) + TechSoup",
      cloud: true,
      notes: "Annual credit, not unlimited Azure. Confirm current SKU in the portal.",
    },
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
    id: "zeffy",
    slug: "zeffy",
    name: "Zeffy",
    category: "marketing",
    offerType: "100_percent_free",
    resourceKind: "vendor_plan",
    summary:
      "0% platform fee donations, ticketing, auctions, memberships, merch, POS, and email — donor-optional tips fund Zeffy.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.zeffy.com/",
    alternativeToUrl: "https://alternativeto.net/software/zeffy/",
    metaResource: false,
    featured: true,
    tags: ["fundraising", "donations", "ticketing", "auctions", "membership", "zeffy"],
    iconHint: "zeffy",
    lastVerifiedAt: "2026-08-11",
    stalenessStatus: "active",
  },
  {
    id: "zoom-nonprofits",
    slug: "zoom-for-nonprofits",
    name: "Zoom for Nonprofits",
    category: "productivity",
    offerType: "tier_discount",
    resourceKind: "vendor_plan",
    summary: "Discounted Zoom Workplace / webinar plans for verified nonprofits.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.zoom.com/en/pricing/zoom-for-nonprofits/",
    alternativeToUrl: "https://alternativeto.net/software/zoom/",
    metaResource: false,
    tags: ["video", "meetings", "zoom"],
    iconHint: "zoom",
    lastVerifiedAt: "2026-08-11",
    stalenessStatus: "active",
  },
  {
    id: "dropbox-nonprofits",
    slug: "dropbox-for-nonprofits",
    name: "Dropbox for Nonprofits",
    category: "productivity",
    offerType: "tier_discount",
    resourceKind: "vendor_plan",
    summary:
      "Team storage discounts — prefer a shared Business team pool; per-seat Basic invites break when folder size exceeds individual quotas.",
    absolutelyFree: false,
    intermediaryRequired: false,
    verification: ["501c3_letter"],
    directPortalUrl: "https://www.dropbox.com/nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/dropbox/",
    metaResource: false,
    tags: ["storage", "files", "dropbox"],
    iconHint: "dropbox",
    lastVerifiedAt: "2026-08-11",
    stalenessStatus: "unverified",
  },
  {
    id: "slack-nonprofits",
    slug: "slack-for-nonprofits",
    name: "Slack for Nonprofits",
    category: "productivity",
    offerType: "freemium_upgrade",
    resourceKind: "vendor_plan",
    summary:
      "Upgraded Pro plan for teams under 250 members; deep discounts on Enterprise. Often verifies via TechSoup.",
    absolutelyFree: true,
    intermediaryRequired: true,
    userSeatLimit: 250,
    verification: ["501c3_letter", "techsoup_token"],
    directPortalUrl: "https://slack.com/for-nonprofits",
    alternativeToUrl: "https://alternativeto.net/software/slack/",
    metaResource: false,
    featured: true,
    tags: ["chat", "collaboration", "slack", "techsoup"],
    iconHint: "slack",
    lastVerifiedAt: "2026-08-11",
    stalenessStatus: "active",
  },
  {
    id: "nonprofit-crm",
    slug: "nonprofit-crm",
    name: "Nonprofit CRM",
    category: "crm",
    offerType: "trial_then_paid",
    resourceKind: "vendor_plan",
    listingKind: "standalone",
    summary:
      "HighLevel-based donor CRM: automations, multi-channel outreach, and fundraising pages. 30-day trial, then paid plans from $97/mo — not a 501(c)(3) discount.",
    details:
      "Public site at nonprofit-crm.com (launch recorded 8–10 Aug 2026). The product is GoHighLevel (HighLevel) positioned for charities: donor profiles, tax-receipt and thank-you automations, campaign pages, SMS/email, and volunteer scheduling.\n\nPricing advertised on the homepage (verified 16 Aug 2026): Starter $97/mo (1 location, up to 3 team members), Unlimited $297/mo, Pro/Agency $497/mo. A 30-day trial is offered; SMS/carrier usage is extra. HighLevel does not publish a vendor nonprofit SKU, and this site does not ask for a determination letter — treat it as commercial SaaS, not a Google/Microsoft-style program.\n\nOwner identity was unclaimed on the Website Launches record when listed. Compare against purpose-built nonprofit CRMs (CiviCRM, Salesforce Nonprofit Cloud, Bloomerang) before committing.",
    absolutelyFree: false,
    intermediaryRequired: false,
    userSeatLimit: 3,
    verification: ["none"],
    directPortalUrl: "https://nonprofit-crm.com/",
    alternativeToUrl: "https://alternativeto.net/software/highlevel/",
    metaResource: false,
    tags: [
      "crm",
      "donors",
      "fundraising",
      "highlevel",
      "gohighlevel",
      "websitelaunches",
    ],
    iconHint: "nonprofit-crm",
    screenshotUrl: "https://nonprofit-crm.com/",
    lastVerifiedAt: "2026-08-16",
    stalenessStatus: "active",
    compare: {
      freeCore: false,
      seatLimit: 3,
      intermediary: false,
      verification: "None (public trial / paid signup)",
      email: true,
      notes:
        "HighLevel white-label/affiliate landing. 30-day trial then $97 / $297 / $497 per month; SMS extra. Starter seat cap is 3; higher plans lift it. Not a vendor 501(c)(3) discount.",
    },
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
    featured: true,
    tags: ["techsoup", "donations", "licenses"],
    iconHint: "techsoup-product-donations",
    lastVerifiedAt: "2026-08-11",
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
    iconHint: "techsoup-nonprofit-software",
    lastVerifiedAt: "2026-08-11",
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
    tags: ["alternatives", "foss", "directory", "oss-project"],
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
    id: "oss-fund",
    slug: "oss-fund",
    name: "OSS.Fund",
    category: "meta_directory",
    offerType: "meta_directory",
    resourceKind: "meta_directory",
    summary:
      "Open Source Sustainability Directory — a catalog of current OSS funding platforms such as Open Collective.",
    details:
      "Independent, editorially reviewed directory of funding, revenue, and support options for open source maintainers and contributors. Source data is public on GitHub under CC BY 4.0. Open-source projects are a subset of nonprofit-style public-goods work, so this listing is a sibling meta-directory: we import overlapping live platforms into the Open source category, and other catalogs can pull ours from /api/catalog.",
    absolutelyFree: true,
    intermediaryRequired: false,
    verification: ["none"],
    directPortalUrl: "https://www.oss.fund/",
    metaResource: true,
    featured: true,
    tags: ["oss.fund", "directory", "funding", "oss-project", "open-collective"],
    iconHint: "oss-fund",
    lastVerifiedAt: "2026-08-15",
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
    tags: ["oss", "devtools", "docs", "oss-project"],
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
    tags: ["oss", "systems", "oss-project"],
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
    tags: ["oss", "photos", "media", "oss-project"],
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
    tags: ["oss", "layout", "oss-project"],
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
    tags: ["oss", "hci", "docs", "oss-project"],
    lastVerifiedAt: "2026-08-09",
    stalenessStatus: "active",
  },
];

function normalizePortal(url: string) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const path = u.pathname.replace(/\/+$/, "") || "";
    return `${host}${path}`;
  } catch {
    return url.toLowerCase().replace(/\/+$/, "");
  }
}

export function isOpenSourceGeared(s: ServiceSeed) {
  return s.category === "open_source" || s.tags.includes("oss-project");
}

function mergeImported(hand: ServiceSeed[], imported: ServiceSeed[]) {
  const slugs = new Set(hand.map((s) => s.slug));
  const urls = new Set(hand.map((s) => normalizePortal(s.directPortalUrl)));
  return [
    ...hand,
    ...imported.filter(
      (s) => !slugs.has(s.slug) && !urls.has(normalizePortal(s.directPortalUrl)),
    ),
  ];
}

export const servicesSeed: ServiceSeed[] = mergeImported(handServicesSeed, ossFundSeed);

export function getServiceBySlug(slug: string) {
  return servicesSeed.find((s) => s.slug === slug);
}

export function getServiceById(id: string) {
  return servicesSeed.find((s) => s.id === id);
}

export function listingKindOf(s: ServiceSeed): ListingKind {
  return s.listingKind ?? "standalone";
}

export function parentOf(s: ServiceSeed) {
  return s.parentId ? getServiceById(s.parentId) : undefined;
}

export function childrenOf(id: string) {
  return servicesSeed.filter((s) => s.parentId === id);
}

export function serviceHref(s: ServiceSeed) {
  const parent = parentOf(s);
  if (parent) return `/services/${parent.slug}/${s.slug}`;
  return `/services/${s.slug}`;
}

export function pathParts(raw: string | string[] | undefined) {
  if (raw == null) return [];
  const joined = Array.isArray(raw) ? raw.join("/") : raw;
  return joined.split("/").filter(Boolean);
}

/** One segment = program/standalone (or barcode an app slug). Two = program/app. */
export function resolveServicePath(parts: string[]): {
  parent?: ServiceSeed;
  service?: ServiceSeed;
  canonical?: string;
} {
  if (parts.length === 1) {
    const service = getServiceBySlug(parts[0]);
    if (!service) return {};
    const parent = parentOf(service);
    return {
      service,
      parent,
      canonical: parent ? serviceHref(service) : `/services/${service.slug}`,
    };
  }
  if (parts.length === 2) {
    const parent = getServiceBySlug(parts[0]);
    const service = servicesSeed.find((s) => s.slug === parts[1] && s.parentId === parent?.id);
    return { parent, service, canonical: service ? serviceHref(service) : undefined };
  }
  return {};
}

export function bypassesGatekeepers(s: ServiceSeed) {
  return !s.intermediaryRequired;
}

export function serviceSearchBlob(s: ServiceSeed) {
  const parent = parentOf(s);
  return [
    s.name,
    s.summary,
    s.details ?? "",
    s.category,
    s.offerType,
    s.resourceKind,
    listingKindOf(s),
    parent?.name ?? "",
    ...s.tags,
  ]
    .join(" ")
    .toLowerCase();
}

export function compareValuesOf(s: ServiceSeed): CompareValues {
  return {
    freeCore: s.absolutelyFree,
    seatLimit: s.userSeatLimit ?? null,
    monetaryCapUsd: s.monetaryCapUsd ?? null,
    intermediary: s.intermediaryRequired,
    verification: s.verification.join(", "),
    ...s.compare,
  };
}

/** Broker / token issuers that gate vendor nonprofit plans. */
export type IntermediaryId = "techsoup" | "goodstack";

export interface IntermediaryInfo {
  id: IntermediaryId;
  name: string;
  /** Short line for the journey cue. */
  role: string;
  logoHint: string;
  portalUrl: string;
  /** In-catalog starting page when we list this broker. */
  catalogSlug?: string;
}

export const INTERMEDIARIES: Record<IntermediaryId, IntermediaryInfo> = {
  techsoup: {
    id: "techsoup",
    name: "TechSoup",
    role: "Verify your org, then unlock vendor grants",
    logoHint: "techsoup-product-donations",
    portalUrl: "https://www.techsoup.org/",
    catalogSlug: "techsoup-product-donations",
  },
  goodstack: {
    id: "goodstack",
    name: "Goodstack",
    role: "Nonprofit validation token for partner discounts",
    logoHint: "placeholder",
    portalUrl: "https://goodstack.org/",
  },
};

const VERIFICATION_TO_INTERMEDIARY: Partial<Record<VerificationReq, IntermediaryId>> = {
  techsoup_token: "techsoup",
  goodstack_token: "goodstack",
};

/** Brokers this offer depends on (excludes the broker’s own catalog rows). */
export function dependsOnIntermediaries(s: ServiceSeed): IntermediaryInfo[] {
  const seen = new Set<IntermediaryId>();
  const out: IntermediaryInfo[] = [];
  for (const v of s.verification) {
    const id = VERIFICATION_TO_INTERMEDIARY[v];
    if (!id || seen.has(id)) continue;
    // Don't say TechSoup “depends on TechSoup”
    if (s.id === id || s.id.startsWith(`${id}-`) || s.slug.startsWith(`${id}-`)) continue;
    seen.add(id);
    out.push(INTERMEDIARIES[id]);
  }
  return out;
}

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  "100_percent_free": "100% free plan",
  tier_discount: "Tier discount",
  grant_credit: "Grant / credits",
  freemium_upgrade: "Free upgrade",
  trial_then_paid: "Trial, then paid",
  diy_oss: "DIY / open source",
  meta_directory: "Meta directory",
};

export const RESOURCE_KIND_LABELS: Record<ResourceKind, string> = {
  vendor_plan: "Vendor nonprofit plan",
  diy_oss: "DIY / open source",
  meta_directory: "Meta directory",
  hardware: "Hardware",
};

export const LISTING_KIND_LABELS: Record<ListingKind, string> = {
  program: "Program",
  app: "Platform app",
  standalone: "Standalone",
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
  open_source: "Open source",
  partner_oss: "Partner OSS",
};
