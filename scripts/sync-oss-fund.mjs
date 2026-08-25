/**
 * Import live, nonprofit/OSS-relevant listings from oss-fund/directory (CC BY 4.0).
 * OSS.Fund has no public API or webhooks; GitHub Markdown is the source they publish.
 *
 * Usage: pnpm catalog:sync-oss-fund
 * Prefers local clone at %code%/github.com/.clones/oss-fund/directory, else a shallow git clone.
 *
 * Provenance: each imported row keeps sticky `firstImportedAt` across regenerations and
 * bumps `lastUpdatedAt` when the source-derived content hash changes. Attribution text is
 * "Imported from OSS.Fund on <firstImportedAt> under CC BY 4.0."
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src", "lib", "oss-fund-seed.generated.ts");
const CODE_ROOT = process.env.code || process.env.CODE_ROOT || "C:\\code";
const localClone = join(CODE_ROOT, "github.com", ".clones", "oss-fund", "directory");

/** First commit that introduced the generated seed (git history). Used to backfill sticky dates. */
const SEED_INTRODUCED_ON = "2026-08-15";
const LICENSE_LABEL = "CC BY 4.0";
const LICENSE_META = "CC-BY-4.0";

const SKIP_CATEGORIES = new Set(["Merchandise", "Advertising", "Paywall", "Staking"]);
const SKIP_TITLES = new Set([
  "Amazon Smile",
  "Apt-get Shirt",
  "Codementor",
  "OpenTeams",
  "Fiverr",
  "Upwork",
  "Flossbank",
  "Fundabit",
  "Gitstore",
  "License Zero",
  "XS Code",
  "PrivJs",
  "Code Code Ship",
  "Staroid",
  "Storj Network",
  "Core Infrastructure Initiative",
  "Free and Open Source Software Audit",
  "Beerpay",
  "Bountysource",
  "CodeFund",
  "Coil",
  "Flattr",
  "GitFund",
]);

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return { fm: {}, body: raw };
  const obj = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const list = line.match(/^-\s+(.*)$/);
    if (list && key) {
      if (!Array.isArray(obj[key])) obj[key] = [];
      obj[key].push(unwrap(list[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const v = kv[2];
      obj[key] = v === "" ? [] : unwrap(v);
    }
  }
  const body = raw.slice(m[0].length).replace(/<!--more-->/g, "").trim();
  return { fm: obj, body };
}

function unwrap(s) {
  return String(s).trim().replace(/^['"]|['"]$/g, "");
}

function asList(v) {
  if (Array.isArray(v)) return v.map(unwrap);
  if (v == null || v === "") return [];
  return [unwrap(v)];
}

function slugify(name, file) {
  const fromFile = String(file || "").replace(/\.md$/i, "");
  if (fromFile) return fromFile.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return String(name || "listing")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isOssGeared(tags, desc) {
  const blob = [...tags, desc].join(" ");
  return /open source friendly|oss-specific|oss specific|\bfoss\b/i.test(blob);
}

function isNonprofitTagged(tags) {
  return tags.some((t) => /non[- ]?profit/i.test(t));
}

function dateOnly(value) {
  const m = String(value || "").match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : "2026-08-15";
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function mapCategory(cats) {
  const set = new Set(cats);
  if (set.has("Infrastructure")) return "cloud_hosting";
  return "open_source";
}

function mapOffer(cats, tags) {
  const set = new Set(cats);
  if (set.has("Infrastructure") || tags.some((t) => /hosting/i.test(t))) return "grant_credit";
  if (set.has("Grants")) return "grant_credit";
  if (set.has("Support")) return "diy_oss";
  if (set.has("Events")) return "grant_credit";
  return "grant_credit";
}

function mapKind(cats, tags) {
  if (tags.some((t) => /self-hosted/i.test(t))) return "diy_oss";
  if (cats.includes("Infrastructure")) return "vendor_plan";
  return "vendor_plan";
}

function absolutelyFree(fm) {
  const fee = String(fm.fee || "").trim();
  const text = String(fm.fee_text || "").toLowerCase();
  if (/^0%?$/.test(fee) || text.includes("no charge") || text.includes("no fee")) return true;
  const cats = asList(fm.categories);
  if (cats.includes("Grants") || cats.includes("Infrastructure")) return true;
  return false;
}

function attributionPhrase(firstImportedAt) {
  return `Imported from OSS.Fund on ${firstImportedAt} under ${LICENSE_LABEL}`;
}

function contentHash(parts) {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex").slice(0, 16);
}

/**
 * Read sticky provenance from the previous generated seed (and optional contentHashes in meta).
 */
function loadPreviousProvenance() {
  /** @type {Map<string, { firstImportedAt?: string, lastUpdatedAt?: string, contentHash?: string }>} */
  const map = new Map();
  if (!existsSync(outFile)) return map;
  const text = readFileSync(outFile, "utf8");
  const metaMatch = text.match(/export const ossFundSeedMeta = (\{\s*[\s\S]*?\n\}) as const;/);
  /** @type {Record<string, string>} */
  let hashes = {};
  if (metaMatch) {
    try {
      const meta = JSON.parse(metaMatch[1]);
      if (meta && typeof meta.contentHashes === "object" && meta.contentHashes) {
        hashes = meta.contentHashes;
      }
    } catch {
      /* ignore malformed previous meta */
    }
  }
  const seedMatch = text.match(/export const ossFundSeed: ServiceSeed\[\] = (\[[\s\S]*\]);\s*$/);
  if (!seedMatch) return map;
  try {
    const items = JSON.parse(seedMatch[1]);
    for (const item of items) {
      if (!item?.id) continue;
      map.set(item.id, {
        firstImportedAt: item.firstImportedAt,
        lastUpdatedAt: item.lastUpdatedAt,
        contentHash: hashes[item.id],
      });
    }
  } catch {
    /* ignore malformed previous seed */
  }
  return map;
}

function toService(file, fm, body, previous, syncDate) {
  const title = unwrap(fm.title || file.replace(/\.md$/i, ""));
  const slug = slugify(title, file);
  const id = `ossfund-${slug}`;
  const cats = asList(fm.categories);
  const tagsIn = asList(fm.tags);
  const portal = unwrap(fm.link || "");
  const desc = unwrap(fm.description || body.split(/\n\s*\n/)[0] || title);
  const ossListing = `https://www.oss.fund/${slug}/`;
  const extraTags = [
    "oss.fund",
    "oss-project",
    ...cats.map((c) => c.toLowerCase().replace(/\s+/g, "-")),
    ...tagsIn.map((t) => t.toLowerCase().replace(/\s+/g, "-")),
  ].filter((t) => t && t !== "live" && t !== "in-development");
  const tags = [...new Set(extraTags)];
  const feeNote = unwrap(fm.fee_text || fm.fee || "");
  const lastVerifiedAt = dateOnly(fm.lastmod || fm.date);
  const free = absolutelyFree(fm);
  const category = mapCategory(cats);
  const offerType = mapOffer(cats, tagsIn);
  const resourceKind = mapKind(cats, tagsIn);

  const hash = contentHash({
    title,
    slug,
    desc,
    body,
    feeNote,
    portal,
    tags,
    category,
    offerType,
    resourceKind,
    free,
    lastVerifiedAt,
  });

  const prev = previous.get(id);
  const isNew = !prev;
  const firstImportedAt = prev?.firstImportedAt || (isNew ? syncDate : SEED_INTRODUCED_ON);
  const contentChanged = !prev?.contentHash || prev.contentHash !== hash;
  const lastUpdatedAt = contentChanged
    ? syncDate
    : prev?.lastUpdatedAt || firstImportedAt;

  const attribution = attributionPhrase(firstImportedAt);
  // Keep the vendor blurb primary; append the dated import clause for catalog cards / quick summary.
  const summaryBase = desc.slice(0, 220).trim();
  const summary = `${summaryBase} ${attribution}.`.replace(/\s+/g, " ").trim();
  const details = [
    body || desc,
    feeNote ? `Fees (OSS.Fund): ${feeNote}` : "",
    `${attribution}. Canonical listing: ${ossListing}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    service: {
      id,
      slug,
      name: title,
      category,
      offerType,
      resourceKind,
      summary,
      details,
      absolutelyFree: free,
      intermediaryRequired: false,
      verification: ["none"],
      directPortalUrl: portal || ossListing,
      metaResource: false,
      tags,
      iconHint: slug,
      lastVerifiedAt,
      stalenessStatus: "active",
      listingKind: "standalone",
      firstImportedAt,
      lastUpdatedAt,
      compare: {
        freeCore: free,
        intermediary: false,
        verification: "Open source project / maintainer (see platform terms)",
        notes: `Source: OSS.Fund. ${feeNote}`.trim(),
      },
    },
    contentHash: hash,
  };
}

function shouldInclude(fm) {
  const status = unwrap(fm.status || "").toLowerCase();
  if (status !== "live") return false;
  const title = unwrap(fm.title || "");
  if (SKIP_TITLES.has(title)) return false;
  const cats = asList(fm.categories);
  if (cats.some((c) => SKIP_CATEGORIES.has(c)) && !isNonprofitTagged(asList(fm.tags))) {
    return false;
  }
  const tags = asList(fm.tags);
  const desc = unwrap(fm.description || "");
  return isOssGeared(tags, desc) || isNonprofitTagged(tags);
}

function gitHead(dir) {
  try {
    return execSync("git rev-parse HEAD", { cwd: dir, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

async function resolvePostsDir() {
  if (existsSync(join(localClone, "posts"))) {
    return { dir: join(localClone, "posts"), commit: gitHead(localClone) };
  }
  const tmp = mkdtempSync(join(tmpdir(), "oss-fund-"));
  execSync("git clone --depth 1 https://github.com/oss-fund/directory.git source", {
    cwd: tmp,
    stdio: "inherit",
  });
  return { dir: join(tmp, "source", "posts"), commit: gitHead(join(tmp, "source")), cleanup: tmp };
}

function emitTs(items, meta) {
  return `import type { ServiceSeed } from "./services-seed";

/** Generated by scripts/sync-oss-fund.mjs from oss-fund/directory (CC BY 4.0). Do not hand-edit. */
export const ossFundSeedMeta = ${JSON.stringify(meta, null, 2)} as const;

export const ossFundSeed: ServiceSeed[] = ${JSON.stringify(items, null, 2)};
`;
}

async function main() {
  const previous = loadPreviousProvenance();
  const syncDate = todayIsoDate();
  const resolved = await resolvePostsDir();
  try {
    const files = readdirSync(resolved.dir).filter((f) => f.endsWith(".md"));
    const items = [];
    /** @type {Record<string, string>} */
    const contentHashes = {};
    for (const file of files) {
      const raw = readFileSync(join(resolved.dir, file), "utf8");
      const { fm, body } = parseFrontmatter(raw);
      if (!shouldInclude(fm)) continue;
      const { service, contentHash: hash } = toService(file, fm, body, previous, syncDate);
      if (!service.directPortalUrl) continue;
      items.push(service);
      contentHashes[service.id] = hash;
    }
    items.sort((a, b) => a.name.localeCompare(b.name));
    const meta = {
      syncedAt: new Date().toISOString(),
      sourceCommit: resolved.commit,
      source: "https://github.com/oss-fund/directory",
      license: LICENSE_META,
      count: items.length,
      contentHashes,
    };
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, emitTs(items, meta));
    console.log(`Wrote ${items.length} OSS.Fund listings → ${outFile}`);
    console.log(
      `Provenance: firstImportedAt sticky (backfill ${SEED_INTRODUCED_ON}); lastUpdatedAt bumps on content hash change.`,
    );
  } finally {
    if (resolved.cleanup) rmSync(resolved.cleanup, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
