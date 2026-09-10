import { SITEMAP_ORIGIN } from "~/lib/sitemap-routes";

export async function GET() {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${SITEMAP_ORIGIN}/sitemap.xml\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
