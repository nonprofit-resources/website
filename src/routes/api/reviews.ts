import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { offeringReviews, orgProfiles } from "~/lib/schema";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "~/lib/db";
import { getSessionUser } from "~/lib/session";
import { listVerifiedReviews } from "~/lib/reviews";
import { getServiceById } from "~/lib/services-seed";

export async function GET(event: { request: Request }) {
  const url = new URL(event.request.url);
  const serviceId = url.searchParams.get("serviceId") ?? "";
  if (!serviceId || !getServiceById(serviceId)) {
    return Response.json({ error: "Unknown offering" }, { status: 400 });
  }
  return Response.json(await listVerifiedReviews(serviceId));
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
