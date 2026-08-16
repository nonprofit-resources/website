import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { offeringReviews, orgProfiles } from "~/lib/schema";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "~/lib/db";
import { getSessionUser } from "~/lib/session";
import { getServiceById } from "~/lib/services-seed";

export async function GET(event: { request: Request }) {
  const url = new URL(event.request.url);
  const serviceId = url.searchParams.get("serviceId") ?? "";
  if (!serviceId || !getServiceById(serviceId)) {
    return Response.json({ error: "Unknown offering" }, { status: 400 });
  }
  if (!hasCommunityDb()) {
    return Response.json({ reviews: [], db: false });
  }
  await ensureCommunitySchema();
  const db = getDb();
  const rows = await db.select().from(offeringReviews).where(eq(offeringReviews.serviceId, serviceId));
  const profiles = await db.select().from(orgProfiles);
  const byUser = new Map(profiles.map((p) => [p.userId, p]));
  const reviews = rows
    .filter((r) => byUser.get(r.userId)?.status === "verified")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => {
      const p = byUser.get(r.userId);
      return {
        id: r.id,
        body: r.body,
        rating: r.rating,
        createdAt: r.createdAt,
        orgName: p?.orgName ?? null,
        displayName: p?.displayName ?? null,
      };
    });
  return Response.json({ reviews, db: true });
}

export async function POST(event: { request: Request }) {
  const user = await getSessionUser(event.request);
  if (!user) return Response.json({ error: "Sign in first" }, { status: 401 });
  if (!hasCommunityDb()) {
    return Response.json(
      { error: "Community database is not attached. Point TURSO_DATABASE_URL at Turso." },
      { status: 503 },
    );
  }
  const body = (await event.request.json()) as {
    serviceId?: string;
    body?: string;
    rating?: number;
  };
  if (!body.serviceId || !getServiceById(body.serviceId)) {
    return Response.json({ error: "Unknown offering" }, { status: 400 });
  }
  const text = body.body?.trim() ?? "";
  if (text.length < 20) {
    return Response.json({ error: "Write at least 20 characters" }, { status: 400 });
  }
  await ensureCommunitySchema();
  const db = getDb();
  await db.insert(offeringReviews).values({
    id: randomUUID(),
    serviceId: body.serviceId,
    userId: user.id,
    body: text,
    rating: typeof body.rating === "number" ? Math.min(5, Math.max(1, body.rating)) : null,
    createdAt: new Date().toISOString(),
  });
  const [profile] = await db.select().from(orgProfiles).where(eq(orgProfiles.userId, user.id));
  const held = profile?.status !== "verified";
  return Response.json({ ok: true, held });
}
