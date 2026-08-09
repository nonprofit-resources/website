/**
 * Download OG/screenshot-ish previews for catalogued services.
 * Uses public URLs; falls back to generated placeholder SVG if fetch fails.
 */
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

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
  { id: "techsoup-product-donations", url: "https://www.techsoup.org/favicon.ico" },
  { id: "techsoup-nonprofit-software", url: "https://www.techsoup.org/favicon.ico" },
  { id: "pcs-for-people", url: "https://www.pcsforpeople.org/favicon.ico" },
  { id: "awesome-free-nonprofits", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "awesome-nonprofit", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "alternativeto", url: "https://alternativeto.net/favicon.ico" },
  { id: "whole-whale", url: "https://www.wholewhale.com/favicon.ico" },
  { id: "nonprofit-tech-for-good", url: "https://www.nptechforgood.com/favicon.ico" },
  { id: "devcentr", url: "https://devcentr.org/favicon.ico" },
  { id: "openshellorg", url: "https://openshellorg.github.io/favicon.ico" },
  { id: "linx-photos", url: "https://linx.photos/favicon.ico" },
  { id: "instalay", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "hci-nerdz", url: "https://hci-nerdz.github.io/favicon.ico" },
];

function placeholderSvg(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f6b55"/>
      <stop offset="100%" stop-color="#c45c2a"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="#f7f3ea"/>
  <rect x="24" y="24" width="592" height="312" rx="16" fill="url(#g)" opacity="0.18"/>
  <text x="320" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#1c3329">${label}</text>
</svg>`;
}

writeFileSync(join(outDir, "placeholder.svg"), placeholderSvg("Nonprofit Resources"));

async function downloadOne({ id, url }) {
  const destPng = join(outDir, `${id}.png`);
  const destIco = join(outDir, `${id}.ico`);
  if (existsSync(destPng)) {
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
    if (ctype.includes("svg") || ctype.includes("icon") || url.endsWith(".ico")) {
      writeFileSync(destIco, buf);
      // Also write a tiny PNG-named file as SVG placeholder wrapper for <img>
      writeFileSync(destPng.replace(/\.png$/, ".png"), buf);
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
console.log("Media download complete →", outDir);
