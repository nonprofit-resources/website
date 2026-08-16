/**
 * Catalog marks that need a light/dark pair.
 * GitHub invertocat + AWS smile + DevCentr orbital mark + cream-tile partner placeholders.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const outDir = join(scriptsDir, "..", "public", "media", "services");
mkdirSync(outDir, { recursive: true });

const githubTemplate = readFileSync(join(scriptsDir, "marks", "github.svg"), "utf8");
const awsTemplate = readFileSync(join(scriptsDir, "marks", "amazonaws.svg"), "utf8");

function tintMark(svg, fill) {
  return svg.replace("<svg", `<svg fill="${fill}"`).replace("<path", `<path fill="${fill}" fill-rule="nonzero"`);
}

function placeholderSvg(label, dark) {
  const gid = `g-${label.replace(/[^a-z0-9]+/gi, "-")}-${dark ? "dark" : "light"}`;
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
</svg>
`;
}

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function writeMark(id, svg, { width = 128, height = 128 } = {}) {
  writeFileSync(join(outDir, `${id}.svg`), svg);
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(width, height, { fit: "contain", background: TRANSPARENT })
    .png()
    .toFile(join(outDir, `${id}.png`));
  console.log("mark", id);
}

export async function writeThemedMarks() {
  await writeMark("github", tintMark(githubTemplate, "#24292F"));
  await writeMark("github-dark", tintMark(githubTemplate, "#FFFFFF"));
  await writeMark("aws", tintMark(awsTemplate, "#FF9900"));
  await writeMark("aws-dark", tintMark(awsTemplate, "#FFFFFF"));

  const tiles = [
    ["placeholder", "Nonprofit Resources"],
    ["openshellorg", "OpenShellOrg"],
    ["hci-nerdz", "HCI Nerdz"],
  ];
  for (const [id, label] of tiles) {
    await writeMark(id, placeholderSvg(label, false), { width: 256, height: 144 });
    await writeMark(`${id}-dark`, placeholderSvg(label, true), { width: 256, height: 144 });
  }

  const dcLight = readFileSync(join(scriptsDir, "marks", "devcentr.svg"), "utf8");
  const dcDark = readFileSync(join(scriptsDir, "marks", "devcentr-dark.svg"), "utf8");
  await writeMark("devcentr", dcLight);
  await writeMark("devcentr-dark", dcDark);
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  await writeThemedMarks();
}
