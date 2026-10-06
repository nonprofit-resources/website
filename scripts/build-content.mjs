// Build news + blog catalogs from content/<kind>/*.adoc
import { load } from "@asciidoctor/core";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function buildKind(kind) {
  const dir = join(root, "content", kind);
  const out = join(root, "src", "lib", `${kind}-posts.generated.json`);
  mkdirSync(dirname(out), { recursive: true });
  if (!existsSync(dir)) {
    writeFileSync(out, JSON.stringify({ posts: [] }, null, 2));
    return;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".adoc"));
  const posts = [];
  for (const file of files) {
    const path = join(dir, file);
    const raw = readFileSync(path, "utf8");
    const doc = await load(raw, { safe: "safe", attributes: { showtitle: false } });
    const slug = file.replace(/\.adoc$/i, "");
    const title = doc.getTitle() || slug;
    const date =
      doc.getAttribute("revdate") ||
      (slug.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] ||
      "";
    const summary = doc.getAttribute("description") || "";
    const html = await doc.convert();
    posts.push({ slug, title, date, summary, html, file });
  }
  posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));

  writeFileSync(out, JSON.stringify({ posts }, null, 2));
  console.log(`Wrote ${posts.length} ${kind} posts → ${out}`);
}

await buildKind("news");
await buildKind("blog");
await buildKind("guides");