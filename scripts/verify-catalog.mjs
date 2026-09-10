/**
 * Re-verify stale hand-authored catalog rows with Gemini (JSON schema).
 * Grounds on fetched portal pages; Google Search only when fetch fails.
 *
 * Usage: pnpm catalog:verify
 * Env: GEMINI_API_KEY (required unless --dry-run), GEMINI_MODEL,
 *      CATALOG_VERIFY_MAX_AGE_DAYS, CATALOG_VERIFY_LIMIT, CATALOG_VERIFY_MIN_CONFIDENCE
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = join(root, "src", "lib", "services-seed.ts");
const reportPath = join(root, "catalog-verify-report.json");
const prBodyPath = join(root, "catalog-verify-pr-body.md");

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const API_KEY = process.env.GEMINI_API_KEY || "";
const MAX_AGE_DAYS = Number(process.env.CATALOG_VERIFY_MAX_AGE_DAYS || "30");
const LIMIT = Number(process.env.CATALOG_VERIFY_LIMIT || "0"); // 0 = all stale
const MIN_CONFIDENCE = Number(process.env.CATALOG_VERIFY_MIN_CONFIDENCE || "0.7");
const DRY_RUN = process.argv.includes("--dry-run") || !API_KEY;

const VERIFICATION_ENUM = [
  "501c3_letter",
  "techsoup_token",
  "goodstack_token",
  "ein_only",
  "work_email_only",
  "none",
];

const PATCH_SCHEMA = {
  type: "object",
  properties: {
    unchanged: {
      type: "boolean",
      description:
        "True when the listing is still accurate; only lastVerifiedAt should be bumped.",
    },
    confidence: {
      type: "number",
      description: "0–1 confidence that proposed changes (or unchanged) match the evidence.",
    },
    rationale: {
      type: "string",
      description: "Short explanation tied to the evidence.",
    },
    citations: {
      type: "array",
      items: { type: "string" },
      description: "Source URLs from the evidence (portal and/or search).",
    },
    summary: {
      type: "string",
      nullable: true,
      description: "Updated one-line summary, or null to leave unchanged.",
    },
    details: {
      type: "string",
      nullable: true,
      description: "Updated details prose, or null to leave unchanged.",
    },
    monetaryCapUsd: {
      type: "number",
      nullable: true,
      description: "USD cap if stated; null clears only when evidence says no cap.",
    },
    userSeatLimit: {
      type: "number",
      nullable: true,
      description: "Seat/user limit if stated; null when unlimited/unknown.",
    },
    stalenessStatus: {
      type: "string",
      nullable: true,
      enum: ["active", "unverified", "deprecated"],
    },
    verification: {
      type: "array",
      nullable: true,
      items: { type: "string", enum: VERIFICATION_ENUM },
    },
    compare: {
      type: "object",
      nullable: true,
      properties: {
        freeCore: { type: "boolean", nullable: true },
        seatLimit: { type: "number", nullable: true },
        monetaryCapUsd: { type: "number", nullable: true },
        intermediary: { type: "boolean", nullable: true },
        verification: { type: "string", nullable: true },
        email: { type: "boolean", nullable: true },
        docs: { type: "boolean", nullable: true },
        ads: { type: "boolean", nullable: true },
        video: { type: "boolean", nullable: true },
        maps: { type: "boolean", nullable: true },
        cloud: { type: "boolean", nullable: true },
        ai: { type: "boolean", nullable: true },
        notes: { type: "string", nullable: true },
      },
    },
  },
  required: ["unchanged", "confidence", "rationale", "citations"],
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(isoDate, now = new Date()) {
  const t = Date.parse(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(t)) return Infinity;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

function extractHandArraySource(fileText) {
  const marker = "const handServicesSeed";
  const startDecl = fileText.indexOf(marker);
  if (startDecl < 0) throw new Error("handServicesSeed not found");
  const eq = fileText.indexOf("= [", startDecl);
  if (eq < 0) throw new Error("handServicesSeed array start not found");
  const arrayStart = eq + 2; // '['
  let depth = 0;
  let i = arrayStart;
  for (; i < fileText.length; i++) {
    const ch = fileText[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return { arrayStart, arrayEnd: i, literal: fileText.slice(arrayStart, i) };
}

function loadHandSeed(fileText) {
  const { literal } = extractHandArraySource(fileText);
  // Object literals are plain JS (no type assertions inside the array).
  return new Function(`"use strict"; return (${literal});`)();
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPortalText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "nonprofit-resources-catalog-verify/0.1 (+https://nonprofit-resources.org)",
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      return { ok: false, status: res.status, text: "", finalUrl: res.url };
    }
    const ct = res.headers.get("content-type") || "";
    const raw = await res.text();
    if (!/html|text|xml|json/i.test(ct) && raw.length > 500_000) {
      return { ok: false, status: res.status, text: "", finalUrl: res.url };
    }
    const text = htmlToText(raw).slice(0, 24_000);
    return { ok: text.length > 80, status: res.status, text, finalUrl: res.url };
  } catch (err) {
    return { ok: false, status: 0, text: "", finalUrl: url, error: String(err) };
  } finally {
    clearTimeout(timer);
  }
}

function candidateText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((p) => p.text || "").join("");
}

async function geminiGenerate({ prompt, tools, jsonSchema }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };
  if (tools?.length) body.tools = tools;
  if (jsonSchema) {
    body.generationConfig = {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: jsonSchema,
    };
  } else {
    body.generationConfig = { temperature: 0.2 };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || JSON.stringify(data).slice(0, 400);
    throw new Error(`Gemini HTTP ${res.status}: ${msg}`);
  }
  return data;
}

async function gatherSearchEvidence(row) {
  const prompt = [
    `Gather current public facts about this nonprofit / OSS offering for catalog verification.`,
    `Name: ${row.name}`,
    `Portal: ${row.directPortalUrl}`,
    `Focus on eligibility, monetary caps, seat limits, verification requirements, and whether the program still exists.`,
    `Reply with a concise plain-text brief and include source URLs inline.`,
  ].join("\n");

  const data = await geminiGenerate({
    prompt,
    tools: [{ googleSearch: {} }],
  });
  const text = candidateText(data).slice(0, 16_000);
  const queries = data?.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];
  const chunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const urls = chunks
    .map((c) => c?.web?.uri)
    .filter(Boolean);
  return {
    text: text || "(no search text)",
    citations: [row.directPortalUrl, ...urls].filter(Boolean),
    queries,
  };
}

function buildPatchPrompt(row, evidence) {
  return [
    `You verify catalog listings for nonprofit-resources.org.`,
    `Use ONLY the evidence below. Do not invent caps, seats, or eligibility.`,
    `If evidence confirms the listing is still accurate, set unchanged=true and leave optional fields null.`,
    `If evidence shows updates, set unchanged=false and fill only fields that should change.`,
    `Always include citations (URLs). confidence must reflect evidence quality.`,
    ``,
    `Current listing JSON:`,
    JSON.stringify(
      {
        id: row.id,
        name: row.name,
        summary: row.summary,
        details: row.details ?? null,
        monetaryCapUsd: row.monetaryCapUsd ?? null,
        userSeatLimit: row.userSeatLimit ?? null,
        verification: row.verification,
        stalenessStatus: row.stalenessStatus,
        lastVerifiedAt: row.lastVerifiedAt,
        directPortalUrl: row.directPortalUrl,
        compare: row.compare ?? null,
      },
      null,
      2,
    ),
    ``,
    `Evidence (${evidence.source}):`,
    evidence.text,
    ``,
    `Known URLs: ${evidence.citations.join(", ")}`,
  ].join("\n");
}

function parsePatch(raw) {
  const text = String(raw || "").trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fence ? fence[1].trim() : text;
  return JSON.parse(jsonText);
}

function formatTsValue(value) {
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) {
      return `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    }
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    const inner = entries
      .map(([k, v]) => `      ${k}: ${formatTsValue(v)},`)
      .join("\n");
    return `{\n${inner}\n    }`;
  }
  return JSON.stringify(value);
}

function findObjectRange(source, id) {
  const needle = `id: "${id}"`;
  const idIdx = source.indexOf(needle);
  if (idIdx < 0) throw new Error(`id ${id} not found in seed`);
  let start = idIdx;
  while (start > 0 && source[start] !== "{") start--;
  let depth = 0;
  let end = start;
  for (; end < source.length; end++) {
    const ch = source[end];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }
  return { start, end };
}

function setPropertyInObject(objectSrc, key, value) {
  const formatted = formatTsValue(value);
  // Match key at start of a line-ish property (not nested compare keys via leading spaces heuristic).
  const re = new RegExp(
    `(^|\\n)([ \\t]*)${key}:\\s*(?:\`[\\s\\S]*?\`|"[^"]*"|'[^']*'|\\[[\\s\\S]*?\\]|\\{[\\s\\S]*?\\}|[^,\\n]+),`,
    "m",
  );
  if (re.test(objectSrc)) {
    return objectSrc.replace(re, `$1$2${key}: ${formatted},`);
  }
  // Insert before closing brace.
  const insert = `    ${key}: ${formatted},\n`;
  return objectSrc.replace(/\n(\s*)\}$/, `\n${insert}$1}`);
}

function applyPatchToSeed(fileText, id, fields) {
  const { start, end } = findObjectRange(fileText, id);
  let obj = fileText.slice(start, end);
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    obj = setPropertyInObject(obj, key, value);
  }
  return fileText.slice(0, start) + obj + fileText.slice(end);
}

function pickStaleRows(rows) {
  const stale = rows.filter((r) => {
    if (r.category === "partner_oss") return false;
    return daysBetween(r.lastVerifiedAt) >= MAX_AGE_DAYS;
  });
  stale.sort((a, b) => daysBetween(b.lastVerifiedAt) - daysBetween(a.lastVerifiedAt));
  if (LIMIT > 0) return stale.slice(0, LIMIT);
  return stale;
}

function acceptedPatch(patch) {
  if (!patch || typeof patch !== "object") return false;
  if (typeof patch.confidence !== "number" || patch.confidence < MIN_CONFIDENCE) return false;
  if (!Array.isArray(patch.citations) || patch.citations.length === 0) return false;
  return true;
}

function fieldsFromPatch(patch, verifiedAt) {
  const fields = { lastVerifiedAt: verifiedAt };
  if (patch.unchanged) {
    if (patch.stalenessStatus) fields.stalenessStatus = patch.stalenessStatus;
    else fields.stalenessStatus = "active";
    return fields;
  }
  for (const key of [
    "summary",
    "details",
    "monetaryCapUsd",
    "userSeatLimit",
    "stalenessStatus",
    "verification",
    "compare",
  ]) {
    if (patch[key] !== undefined && patch[key] !== null) {
      fields[key] = patch[key];
    }
  }
  if (!fields.stalenessStatus) fields.stalenessStatus = "active";
  return fields;
}

async function verifyRow(row) {
  const portal = await fetchPortalText(row.directPortalUrl);
  let evidence;
  if (portal.ok) {
    evidence = {
      source: "portal_fetch",
      text: portal.text,
      citations: [portal.finalUrl || row.directPortalUrl],
    };
  } else if (DRY_RUN) {
    evidence = {
      source: "dry_run_no_portal",
      text: `(fetch failed: status=${portal.status} ${portal.error || ""})`,
      citations: [row.directPortalUrl],
    };
  } else {
    evidence = await gatherSearchEvidence(row);
    evidence.source = "google_search_fallback";
  }

  if (DRY_RUN) {
    return {
      id: row.id,
      name: row.name,
      status: "dry_run",
      evidenceSource: evidence.source,
      evidenceChars: evidence.text.length,
    };
  }

  const data = await geminiGenerate({
    prompt: buildPatchPrompt(row, evidence),
    jsonSchema: PATCH_SCHEMA,
  });
  const patch = parsePatch(candidateText(data));
  return {
    id: row.id,
    name: row.name,
    status: "ok",
    evidenceSource: evidence.source,
    patch,
    accepted: acceptedPatch(patch),
  };
}

function writePrBody(report) {
  const lines = [
    `## Catalog verify (${report.model})`,
    ``,
    `Automated Gemini re-verification of hand-authored listings older than **${report.maxAgeDays}** days.`,
    ``,
    `- Checked: ${report.checked}`,
    `- Applied: ${report.applied}`,
    `- Skipped / rejected: ${report.skipped}`,
    `- Dry run: ${report.dryRun}`,
    ``,
    `### Results`,
    ``,
  ];
  for (const r of report.results) {
    const conf =
      r.patch && typeof r.patch.confidence === "number"
        ? ` conf=${r.patch.confidence.toFixed(2)}`
        : "";
    const flag = r.applied ? "applied" : r.status;
    lines.push(
      `- **${r.id}** (${flag}${conf}; ${r.evidenceSource || "?"})${r.patch?.rationale ? ` — ${r.patch.rationale}` : ""}`,
    );
  }
  lines.push(
    ``,
    `Review the diff in \`src/lib/services-seed.ts\` before merge. Do not auto-merge.`,
    ``,
    `Full report: \`catalog-verify-report.json\`.`,
  );
  writeFileSync(prBodyPath, lines.join("\n"), "utf8");
}

async function main() {
  const fileText = readFileSync(seedPath, "utf8");
  const hand = loadHandSeed(fileText);
  const targets = pickStaleRows(hand);

  const report = {
    ranAt: new Date().toISOString(),
    model: MODEL,
    maxAgeDays: MAX_AGE_DAYS,
    minConfidence: MIN_CONFIDENCE,
    dryRun: DRY_RUN,
    checked: targets.length,
    applied: 0,
    skipped: 0,
    results: [],
  };

  if (DRY_RUN && !API_KEY) {
    console.log("GEMINI_API_KEY unset — dry run (fetch only, no model patches).");
  }

  let nextText = fileText;
  const verifiedAt = todayIso();

  for (const row of targets) {
    console.log(`Verifying ${row.id} (lastVerifiedAt=${row.lastVerifiedAt})…`);
    try {
      const result = await verifyRow(row);
      if (result.status === "dry_run") {
        report.skipped++;
        report.results.push(result);
        continue;
      }
      if (!result.accepted) {
        report.skipped++;
        report.results.push({ ...result, applied: false, reason: "low_confidence_or_no_citations" });
        continue;
      }
      const fields = fieldsFromPatch(result.patch, verifiedAt);
      nextText = applyPatchToSeed(nextText, row.id, fields);
      report.applied++;
      report.results.push({ ...result, applied: true, fields });
    } catch (err) {
      report.skipped++;
      report.results.push({
        id: row.id,
        name: row.name,
        status: "error",
        applied: false,
        error: String(err?.message || err),
      });
      console.error(`  error: ${err?.message || err}`);
    }
  }

  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  writePrBody(report);

  if (report.applied > 0 && nextText !== fileText) {
    writeFileSync(seedPath, nextText, "utf8");
    console.log(`Updated ${seedPath} (${report.applied} row(s)).`);
  } else {
    console.log("No seed changes written.");
  }

  console.log(`Report: ${reportPath}`);
  console.log(
    JSON.stringify(
      { checked: report.checked, applied: report.applied, skipped: report.skipped, dryRun: report.dryRun },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
