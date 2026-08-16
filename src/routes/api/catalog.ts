import { catalogFeed } from "~/lib/catalog-api";

export async function GET() {
  return Response.json(catalogFeed(), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
