/**
 * Download OG/screenshot-ish previews for catalogued services.
 * Uses public URLs; falls back to generated placeholder SVG if fetch fails.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { writeThemedMarks } from "./write-themed-marks.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "media", "services");
mkdirSync(outDir, { recursive: true });

const targets = [
  { id: "google", url: "https://www.google.com/favicon.ico" },
  { id: "microsoft", url: "https://www.microsoft.com/favicon.ico" },
  { id: "github", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "canva", url: "https://www.canva.com/favicon.ico" },
  // Site favicon is a 16px stub; apple-touch webclip is the public square mark.
  {
    id: "zeffy",
    url: "https://cdn.prod.website-files.com/60af7f6d21134db12548f5b9/62571f35988311609cfeccf2_zeffy-webclip2.png",
  },
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
  // Current linx.photos brand SVG (do not reuse bigrpic ICO stubs).
  { id: "linx-photos", url: "https://linx.photos/favicon.svg" },
  { id: "instalay", url: "https://github.githubassets.com/favicons/favicon.png" },
  { id: "hci-nerdz", url: "https://hci-nerdz.github.io/favicon.ico" },
  { id: "google-workspace", url: "https://workspace.google.com/favicon.ico" },
  { id: "google-ad-grants", url: "https://ads.google.com/favicon.ico" },
  { id: "youtube", url: "https://www.youtube.com/favicon.ico" },
  { id: "google-maps", url: "https://maps.gstatic.com/favicon.ico" },
  // microsoft365.com serves HTML as "favicon" — alias to microsoft in service-marks.ts
  { id: "microsoft-azure", url: "https://azure.microsoft.com/favicon.ico" },
  { id: "dropbox", url: "https://cfl.dropboxstatic.com/static/metaserver/static/images/favicon.ico" },
  { id: "zoom", url: "https://zoom.us/favicon.ico" },
  // OSS.Fund import marks
  { id: "algora", url: "https://algora.io/images/logo-192px.png" },
  { id: "bepro-network", url: "https://bepro.network/favicon.ico" },
  { id: "bountyhub", url: "https://www.bountyhub.dev/apple-touch-icon.png" },
  {
    id: "codeheat",
    url: "https://i0.wp.com/codeheat.org/wp-content/uploads/2025/06/cropped-code-logo.png?fit=192%2C192&ssl=1",
  },
  {
    id: "community-bridge",
    url: "https://lfx.linuxfoundation.org/wp-content/uploads/2022/12/cropped-favicon-192x192.png",
  },
  {
    id: "eventyay",
    url: "https://eventyay.com/static/common/img/icons/apple-touch-icon-180x180.png",
  },
  {
    id: "faiross",
    url: "https://images.squarespace-cdn.com/content/5e854f063c753f3e43bf0e1d/1592340007036-536EVTQNLDK4MCR228P7/FairOSS-Icon.png?format=300w",
  },
  // fundrequest.io was returning 522 at audit time — skip until the portal is back.
  { id: "gitcoin", url: "https://gitcoin.co/favicon.ico" },
  { id: "git-pay", url: "https://gitpay.me/favicon-gitpay.ico" },
  {
    id: "summer-of-code",
    url: "https://summerofcode.withgoogle.com/assets/favicons/apple-touch-icon.png",
  },
  { id: "goteo", url: "https://www.goteo.org/favicon.ico" },
  {
    id: "issue-hunt",
    url: "https://cdn.prod.website-files.com/62308acfa5c2a57a354a083b/6237e1a0e967842500ba5c6e_issuehunt-logo-v1%201.png",
  },
  {
    id: "liberapay",
    url: "https://liberapay.com/assets/liberapay/icon-v2_black-on-yellow.200.png",
  },
  { id: "nl-net", url: "https://nlnet.nl/favicon.ico" },
  { id: "numfocus", url: "https://numfocus.org/favicon.ico" },
  {
    id: "open-collective",
    url: "https://opencollective.com/static/images/opencollective-icon.svg",
  },
  {
    id: "open-source-design",
    url: "https://opensourcedesign.net/images/favicons/apple-touch-icon.png",
  },
  { id: "osuosl", url: "https://osuosl.org/favicon/apple-touch-icon.png" },
  {
    id: "openssf",
    url: "https://openssf.org/wp-content/uploads/2021/09/cropped-favicon-300x300.png",
  },
  { id: "opire", url: "https://opire.dev/assets/favicon.ico" },
  {
    id: "season-of-docs",
    url: "https://www.gstatic.com/devrel-devsite/prod/v1acc34b77907f14029db47214a9900819f8c09315bec13906695eded017dc4b4/developers/images/touchicon-180-new.png",
  },
  { id: "sf-conservancy", url: "https://sfconservancy.org/static/favicon.641dcd867f20.ico" },
  { id: "spi", url: "https://www.spi-inc.org/favicon.ico" },
  {
    id: "sovereign-tech-fund",
    url: "https://www.sovereign.tech/static/images/favicons/apple-touch-icon.png",
  },
  // Tidelift redirects to Sonar; public favicon is the shippable mark.
  { id: "tidelift", url: "https://www.sonarsource.com/favicon.ico" },
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
  const head = buf.subarray(0, 96).toString("utf8").trimStart().toLowerCase();
  return (
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.startsWith("<!--") ||
    head.includes("<meta name=\"robots\"")
  );
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

/** Many vendor .ico files embed a PNG; sharp cannot decode ICO directly. */
function pngFromIco(buf) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  let best = null;
  let idx = 0;
  while (idx < buf.length) {
    const at = buf.indexOf(sig, idx);
    if (at < 0) break;
    const candidate = buf.subarray(at);
    if (!best || candidate.length > best.length) best = candidate;
    idx = at + 8;
  }
  return best;
}

async function rasterizeToPng(buf, destPng) {
  await sharp(buf, { density: 256 })
    .resize(192, 192, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(destPng);
}

async function downloadOne({ id, url }) {
  const destPng = join(outDir, `${id}.png`);
  const destIco = join(outDir, `${id}.ico`);
  const destSvg = join(outDir, `${id}.svg`);
  if (isUsableImage(destPng) || isUsableImage(destIco) || isUsableImage(destSvg)) {
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
    const isSvg =
      ctype.includes("svg") ||
      url.endsWith(".svg") ||
      buf.toString("utf8", 0, 200).includes("<svg");
    if (isSvg) {
      writeFileSync(destSvg, buf);
      try {
        await rasterizeToPng(buf, destPng);
      } catch {
        /* SVG alone is enough for ServiceMarkImg fallback */
      }
      console.log("ok", id, "svg", buf.length);
      return;
    }
    const isIco =
      ctype.includes("icon") ||
      url.includes(".ico") ||
      (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00);
    if (isIco) {
      writeFileSync(destIco, buf);
      const embedded = pngFromIco(buf);
      if (embedded) {
        try {
          await rasterizeToPng(embedded, destPng);
        } catch {
          writeFileSync(destPng, embedded);
        }
      }
      console.log("ok", id, "ico", buf.length);
      return;
    }
    writeFileSync(destPng, buf);
    console.log("ok", id, buf.length);
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
