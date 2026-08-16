import { dispatchCatalogUpdated } from "~/lib/webhooks";

export async function POST(event: { request: Request }) {
  const expected = process.env.CATALOG_WEBHOOK_DISPATCH_SECRET;
  if (!expected) {
    return Response.json({ error: "Dispatch secret is not configured" }, { status: 503 });
  }
  const got =
    event.request.headers.get("x-catalog-webhook-token") ??
    (event.request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (got !== expected) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await event.request.json().catch(() => ({}))) as { reason?: string };
  const result = await dispatchCatalogUpdated(body.reason ?? "dispatch");
  return Response.json({ ok: true, ...result });
}
