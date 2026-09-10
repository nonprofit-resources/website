import { getSitemapRoutes, SITEMAP_ORIGIN } from "~/lib/sitemap-routes";

function escapeXml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toLoc(route: string) {
  if (route === "/") return `${SITEMAP_ORIGIN}/`;
  return `${SITEMAP_ORIGIN}${route}`;
}

export async function GET() {
  const locs = getSitemapRoutes().map(toLoc);
  const body = locs.map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
