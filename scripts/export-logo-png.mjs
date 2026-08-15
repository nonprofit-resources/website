import sharp from "sharp";
import { copyFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const svgPath = resolve(root, ".github/assets/logo.svg");
const pub = resolve(root, "website/public");
const svg = readFileSync(svgPath);
const buf = Buffer.from(svg);

copyFileSync(svgPath, resolve(pub, "logo.svg"));
copyFileSync(svgPath, resolve(pub, "favicon.svg"));
await sharp(buf).resize(512, 512).png().toFile(resolve(root, ".github/assets/logo.png"));
await sharp(buf).resize(256, 256).png().toFile(resolve(root, ".github/assets/logo-256.png"));
await sharp(buf).resize(512, 512).png().toFile(resolve(pub, "logo.png"));
await sharp(buf).resize(256, 256).png().toFile(resolve(pub, "logo-256.png"));
console.log("Exported logo.svg + favicon.svg + logo.png (512) + logo-256.png");
