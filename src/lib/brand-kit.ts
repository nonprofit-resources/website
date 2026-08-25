/** Public brand kit tokens and downloadable assets for Nonprofit Resources. */

export const BRAND_NAME = "Nonprofit Resources";
export const BRAND_DOMAIN = "nonprofit-resources.org";
export const BRAND_TAGLINE = "Cataloguing nonprofit plans, DIY options, and free software.";

export const BRAND_KIT_PATH = "/brand";

/** Keyword-rich aliases that share the brand kit page (canonical → /brand). */
export const BRAND_KIT_ALIASES = [
  "/brand-kit",
  "/media-kit",
  "/press-kit",
  "/branding",
  "/brand-guidelines",
  "/style-guide",
  "/logo",
] as const;

export type BrandColor = {
  name: string;
  role: string;
  hex: string;
  cssVar?: string;
};

export const BRAND_COLORS: BrandColor[] = [
  {
    name: "Forest",
    role: "Primary / wordmark ink on cream",
    hex: "#2F6B55",
    cssVar: "--primary",
  },
  {
    name: "Deep canopy",
    role: "Logo palm depth / dark-mode ink base",
    hex: "#0D2A22",
    cssVar: "--foreground",
  },
  {
    name: "Heart clay",
    role: "Accent / CTAs that need warmth",
    hex: "#C45C2A",
    cssVar: "--accent",
  },
  {
    name: "Cream tile",
    role: "Logo ground / light surfaces",
    hex: "#F4F0E6",
    cssVar: "--background",
  },
  {
    name: "Parchment stroke",
    role: "Logo outlines on the tiled mark",
    hex: "#F7F4EC",
  },
];

export type BrandAsset = {
  label: string;
  href: string;
  format: string;
  note: string;
};

export const BRAND_ASSETS: BrandAsset[] = [
  {
    label: "Tiled logo (SVG)",
    href: "/logo.svg",
    format: "SVG",
    note: "Preferred vector — cream tile + giving hand",
  },
  {
    label: "Tiled logo (PNG)",
    href: "/logo.png",
    format: "PNG",
    note: "Raster master",
  },
  {
    label: "Tiled logo 256",
    href: "/logo-256.png",
    format: "PNG",
    note: "Avatar / social square",
  },
  {
    label: "Mark only (SVG)",
    href: "/logo-only.svg",
    format: "SVG",
    note: "Hand + heart, no cream tile",
  },
  {
    label: "Mark only (PNG)",
    href: "/logo-only.png",
    format: "PNG",
    note: "Transparent-friendly raster",
  },
  {
    label: "Mark only 256",
    href: "/logo-only-256.png",
    format: "PNG",
    note: "Favicon / app icon sibling",
  },
  {
    label: "Favicon",
    href: "/favicon.svg",
    format: "SVG",
    note: "Browser tab mark",
  },
];

export const BRAND_TYPE = {
  family: "Plus Jakarta Sans",
  stack: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  roles: "Display, UI, and mono all share the same family — one voice, not a newspaper stack.",
  source: "https://fonts.google.com/specimen/Plus+Jakarta+Sans",
};

export const BRAND_SEO = {
  title: `Brand kit, media kit & logo downloads · ${BRAND_NAME}`,
  description:
    "Official Nonprofit Resources brand kit, media kit, press kit, brand guidelines, and style guide — logo SVG/PNG downloads, color palette, typography, and usage rules for nonprofit-resources.org.",
  keywords: [
    "Nonprofit Resources brand kit",
    "Nonprofit Resources media kit",
    "Nonprofit Resources press kit",
    "nonprofit brand guidelines",
    "nonprofit style guide",
    "logo download SVG PNG",
    "brand assets",
    "branding page",
    "color palette",
    "typography",
    "favicon",
    "nonprofit-resources.org logo",
    "giving hand logo",
  ].join(", "),
};
