import { isStaffEmail, getSessionUser } from "~/lib/session";
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  dispatchCatalogUpdated,
  listWebhookEndpoints,
} from "~/lib/webhooks";
import { SITE_URL } from "~/lib/utils";

function bearer(request: Request) {
  const h = request.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? request.headers.get("x-catalog-webhook-token");
}

function hasAdminToken(request: Request) {
  const configured = process.env.CATALOG_WEBHOOK_ADMIN_TOKEN;
  if (!configured) return false;
  return bearer(request) === configured;
}

async function requireAdmin(request: Request) {
  if (hasAdminToken(request)) return true;
  const user = await getSessionUser(request);
  if (user && isStaffEmail(user.email)) return true;
  return false;
}

export async function GET() {
  return Response.json({
    pull: `${SITE_URL}/api/catalog`,
    subscribe: `${SITE_URL}/api/webhooks`,
    events: ["catalog.updated"],
    githubInbound: `${SITE_URL}/api/webhooks/github`,
    notes:
      "OSS.Fund publishes Markdown on GitHub, not an API. Register here (staff token) to receive catalog.updated, or poll /api/catalog.",
  });
}

export async function POST(event: { request: Request }) {
  if (!(await requireAdmin(event.request))) {
    return Response.json(
      { error: "Staff session or CATALOG_WEBHOOK_ADMIN_TOKEN bearer required" },
      { status: 401 },
    );
  }
  try {
    const body = (await event.request.json()) as {
      url?: string;
      events?: string[];
      note?: string;
    };
    if (!body.url?.trim()) return Response.json({ error: "url is required" }, { status: 400 });
    const created = await createWebhookEndpoint({
      url: body.url.trim(),
      events: body.events,
      note: body.note,
    });
    return Response.json({
      ok: true,
      ...created,
      ping: { method: "POST", path: "/api/webhooks/dispatch" },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Could not subscribe" },
      { status: 400 },
    );
  }
}

export async function DELETE(event: { request: Request }) {
  if (!(await requireAdmin(event.request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(event.request.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "id query param required" }, { status: 400 });
  await deleteWebhookEndpoint(id);
  return Response.json({ ok: true });
}

/** Staff-only listing of destinations (secrets omitted). */
export async function PUT(event: { request: Request }) {
  if (!(await requireAdmin(event.request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await listWebhookEndpoints();
  const action = (await event.request.json().catch(() => ({}))) as { dispatch?: boolean };
  if (action.dispatch) {
    const result = await dispatchCatalogUpdated("manual");
    return Response.json({ ok: true, ...result });
  }
  return Response.json({
    endpoints: rows.map((r) => ({
      id: r.id,
      url: r.url,
      events: JSON.parse(r.eventsJson),
      createdAt: r.createdAt,
      lastDeliveryAt: r.lastDeliveryAt,
      lastStatus: r.lastStatus,
      disabled: r.disabled,
      note: r.note,
    })),
  });
}
