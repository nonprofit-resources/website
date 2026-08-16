export type CompareValueKind = "boolean" | "number" | "money" | "text";

export interface CompareFeatureDef {
  key: keyof CompareValues;
  label: string;
  group: string;
  kind: CompareValueKind;
}

/** Shared columns for the comparison table. Missing values render as an em dash. */
export interface CompareValues {
  freeCore?: boolean;
  seatLimit?: number | null;
  monetaryCapUsd?: number | null;
  intermediary?: boolean;
  verification?: string;
  email?: boolean;
  docs?: boolean;
  ads?: boolean;
  video?: boolean;
  maps?: boolean;
  cloud?: boolean;
  ai?: boolean;
  notes?: string;
}

export const COMPARE_FEATURES: CompareFeatureDef[] = [
  { key: "freeCore", label: "Free core offer", group: "Cost", kind: "boolean" },
  { key: "monetaryCapUsd", label: "Credit / grant cap (USD)", group: "Cost", kind: "money" },
  { key: "seatLimit", label: "Seat / user cap", group: "Limits", kind: "number" },
  { key: "intermediary", label: "Broker token required", group: "Eligibility", kind: "boolean" },
  { key: "verification", label: "Verification", group: "Eligibility", kind: "text" },
  { key: "email", label: "Org email", group: "Product", kind: "boolean" },
  { key: "docs", label: "Docs / Drive", group: "Product", kind: "boolean" },
  { key: "ads", label: "Ad inventory", group: "Product", kind: "boolean" },
  { key: "video", label: "Video / YouTube", group: "Product", kind: "boolean" },
  { key: "maps", label: "Maps / location", group: "Product", kind: "boolean" },
  { key: "cloud", label: "Cloud compute", group: "Product", kind: "boolean" },
  { key: "ai", label: "AI tools included", group: "Product", kind: "boolean" },
  { key: "notes", label: "Notes", group: "Product", kind: "text" },
];

export function formatCompareValue(
  kind: CompareValueKind,
  value: CompareValues[keyof CompareValues],
): string {
  if (value == null || value === "") return "—";
  if (kind === "boolean") return value ? "Yes" : "No";
  if (kind === "money" && typeof value === "number") return `$${value.toLocaleString()} USD`;
  if (kind === "number" && typeof value === "number") return value.toLocaleString();
  return String(value);
}
