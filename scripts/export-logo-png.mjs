import sharp from "sharp";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SIZE = 128;
const TILE_RX = 28;
const TILE_FILL = "#F4F0E6";
/** ViewBox units of cream between the mark bbox and the tile edge (tight axis). */
const FAVICON_INSET = 6;
const TILE_BG = /[ \t]*<rect width="128" height="128" rx="28"[^>]*\/?>\r?\n?/;

const root = resolve(import.meta.dirname, "../..");
const assets = resolve(root, ".github/assets");
const pub = resolve(root, "website/public");
const svgPath = resolve(assets, "logo.svg");
const svg = readFileSync(svgPath, "utf8");

if (!TILE_BG.test(svg)) {
  throw new Error("Could not find the 128×128 tile background in .github/assets/logo.svg");
}
const markSvg = svg.replace(TILE_BG, "");

function innerMarkup(svgText) {
  return svgText.slice(svgText.indexOf(">") + 1, svgText.lastIndexOf("</svg>")).trim();
}

function fmt(n) {
  return Number.parseFloat(n.toFixed(3));
}

async function markBBox(markText) {
  const px = 8;
  const raster = await sharp(Buffer.from(markText))
    .resize(SIZE * px, SIZE * px)
    .ensureAlpha()
    .png()
    .toBuffer();
  const { info } = await sharp(raster)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .toBuffer({ resolveWithObject: true });
  return {
    x: -info.trimOffsetLeft / px,
    y: -info.trimOffsetTop / px,
    w: info.width / px,
    h: info.height / px,
  };
}

function buildFaviconSvg(markText, bbox) {
  const avail = SIZE - 2 * FAVICON_INSET;
  const s = Math.min(avail / bbox.w, avail / bbox.h);
  const tx = (SIZE - bbox.w * s) / 2;
  const ty = (SIZE - bbox.h * s) / 2;
  const tf = `translate(${fmt(tx)} ${fmt(ty)}) scale(${fmt(s)}) translate(${fmt(-bbox.x)} ${fmt(-bbox.y)})`;
  const inner = innerMarkup(markText)
    .split(/\r?\n/)
    .map((line) => (line ? `    ${line}` : line))
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" fill="none">
  <rect width="${SIZE}" height="${SIZE}" rx="${TILE_RX}" fill="${TILE_FILL}"/>
  <g transform="${tf}">
${inner}
  </g>
</svg>
`;
}

const bbox = await markBBox(markSvg);
const faviconSvg = buildFaviconSvg(markSvg, bbox);
const markBuf = Buffer.from(markSvg);
const tiledBuf = Buffer.from(svg);
const markPath = resolve(assets, "logo-only.svg");
const faviconPath = resolve(assets, "favicon.svg");
writeFileSync(markPath, markSvg);
writeFileSync(faviconPath, faviconSvg);

copyFileSync(svgPath, resolve(pub, "logo.svg"));
copyFileSync(markPath, resolve(pub, "logo-only.svg"));
copyFileSync(faviconPath, resolve(pub, "favicon.svg"));

await sharp(tiledBuf).resize(512, 512).png().toFile(resolve(assets, "logo.png"));
await sharp(tiledBuf).resize(256, 256).png().toFile(resolve(assets, "logo-256.png"));
await sharp(tiledBuf).resize(512, 512).png().toFile(resolve(pub, "logo.png"));
await sharp(tiledBuf).resize(256, 256).png().toFile(resolve(pub, "logo-256.png"));
await sharp(markBuf).resize(512, 512).png().toFile(resolve(assets, "logo-only.png"));
await sharp(markBuf).resize(256, 256).png().toFile(resolve(assets, "logo-only-256.png"));
await sharp(markBuf).resize(512, 512).png().toFile(resolve(pub, "logo-only.png"));
await sharp(markBuf).resize(256, 256).png().toFile(resolve(pub, "logo-only-256.png"));

console.log(
  `Exported tiled logo, logo-only, and favicon (mark scaled into tile, inset ${FAVICON_INSET})`,
);
