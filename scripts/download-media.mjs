/**
 * Download OG/screenshot-ish previews for catalogued services.
 * Uses public URLs; falls back to generated placeholder SVG if fetch fails.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { writeThemedMarks } from "./write-themed-marks.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "media", "services");
mkdirSync(outDir, { recursive: true });

const targets = [
  { id: "google", url: "https://www.google.com/favicon.ico" },
  { id: "microsoft", url: "https://www.microsoft.com/favicon.ico" },
  { id: "github", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "canva", url: "https://www.canva.com/favicon.ico" },
  { id: "slack", url: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png" },
  { id: "aws", url: "https://a0.awsstatic.com/libra-css/images/site/touch-icon-ipad-144-smile.png" },
  // techsoup.org/favicon.ico is Incapsula HTML; Facebook page picture is the public S mark.
  { id: "techsoup", url: "https://graph.facebook.com/techsoup/picture?type=large" },
  { id: "pcs-for-people", url: "https://www.pcsforpeople.org/favicon.ico" },
  { id: "awesome-free-nonprofits", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "awesome-nonprofit", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "alternativeto", url: "https://alternativeto.net/favicon.ico" },
  { id: "whole-whale", url: "https://www.wholewhale.com/favicon.ico" },
  { id: "nonprofit-tech-for-good", url: "https://www.nptechforgood.com/favicon.ico" },
  { id: "oss-fund", url: "https://www.oss.fund/favicon.ico" },
  { id: "devcentr", url: "https://devcentr.org/brand/logo.svg" },
  { id: "openshellorg", url: "https://openshellorg.github.io/favicon.ico" },
  { id: "linx-photos", url: "https://linx.photos/favicon.ico" },
  { id: "instalay", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "hci-nerdz", url: "https://hci-nerdz.github.io/favicon.ico" },
  { id: "google-workspace", url: "https://workspace.google.com/favicon.ico" },
  { id: "google-ad-grants", url: "https://ads.google.com/favicon.ico" },
  { id: "youtube", url: "https://www.youtube.com/favicon.ico" },
  { id: "google-maps", url: "https://maps.gstatic.com/favicon.ico" },
  { id: "microsoft-365", url: "https://www.microsoft365.com/favicon.ico" },
  { id: "microsoft-azure", url: "https://azure.microsoft.com/favicon.ico" },
];

function placeholderSvg(label, dark = false) {
  const gid = `g-${String(label).replace(/[^a-z0-9]+/gi, "-")}-${dark ? "dark" : "light"}`;
  const bg = dark ? "#1c3329" : "#f7f3ea";
  const fg = dark ? "#f7f3ea" : "#1c3329";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f6b55"/>
      <stop offset="100%" stop-color="#c45c2a"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="${bg}"/>
  <rect x="24" y="24" width="592" height="312" rx="16" fill="url(#${gid})" opacity="${dark ? "0.35" : "0.18"}"/>
  <text x="320" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${fg}">${label}</text>
</svg>`;
}

writeFileSync(join(outDir, "placeholder.svg"), placeholderSvg("Nonprofit Resources"));

function looksLikeHtml(buf) {
  const head = buf.subarray(0, 64).toString("utf8").trimStart().toLowerCase();
  return head.startsWith("<!doctype") || head.startsWith("<html") || head.includes("<meta name=\"robots\"");
}

function isUsableImage(path) {
  if (!existsSync(path)) return false;
  try {
    const buf = readFileSync(path);
    if (buf.length < 64 || looksLikeHtml(buf)) return false;
    // PNG / JPEG / GIF / ICO / RIFF(webp) / SVG
    const sig = buf.subarray(0, 12);
    if (sig[0] === 0x89 && sig[1] === 0x50) return true; // PNG
    if (sig[0] === 0xff && sig[1] === 0xd8) return true; // JPEG
    if (sig[0] === 0x47 && sig[1] === 0x49) return true; // GIF
    if (sig[0] === 0x00 && sig[1] === 0x00 && sig[2] === 0x01) return true; // ICO
    if (sig.toString("ascii", 0, 4) === "RIFF") return true;
    if (buf.toString("utf8", 0, 200).includes("<svg")) return true;
    return false;
  } catch {
    return false;
  }
}

async function downloadOne({ id, url }) {
  const destPng = join(outDir, `${id}.png`);
  const destIco = join(outDir, `${id}.ico`);
  if (isUsableImage(destPng) || isUsableImage(destIco)) {
    console.log("skip", id);
    return;
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "nonprofit-resources-media-bot/0.1" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ctype = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (looksLikeHtml(buf) || ctype.includes("text/html")) {
      throw new Error("got HTML instead of image (bot wall?)");
    }
    if (ctype.includes("svg") || ctype.includes("icon") || url.endsWith(".ico")) {
      writeFileSync(destIco, buf);
      writeFileSync(destPng, buf);
      console.log("ok", id, buf.length);
    } else {
      writeFileSync(destPng, buf);
      console.log("ok", id, buf.length);
    }
  } catch (err) {
    writeFileSync(join(outDir, `${id}.svg`), placeholderSvg(id));
    console.warn("fallback", id, err instanceof Error ? err.message : err);
  }
}

for (const t of targets) {
  await downloadOne(t);
}
await writeThemedMarks();
console.log("Media download complete →", outDir);
