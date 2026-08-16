import { eq } from "drizzle-orm";
import { orgProfiles } from "~/lib/schema";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "~/lib/db";
import { getSessionUser, isStaffEmail } from "~/lib/session";

async function requireStaff(request: Request) {
  const user = await getSessionUser(request);
  if (!user || !isStaffEmail(user.email)) {
    return { user: null as null, error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, error: null };
}

export async function GET(event: { request: Request }) {
  const gate = await requireStaff(event.request);
  if (gate.error) return gate.error;
  if (!hasCommunityDb()) return Response.json({ profiles: [], db: false });
  await ensureCommunitySchema();
  const db = getDb();
  const profiles = await db.select().from(orgProfiles);
  return Response.json({ profiles, db: true });
}

export async function POST(event: { request: Request }) {
  const gate = await requireStaff(event.request);
  if (gate.error) return gate.error;
  if (!hasCommunityDb()) {
    return Response.json({ error: "No community database" }, { status: 503 });
  }
  const body = (await event.request.json()) as {
    userId?: string;
    status?: "verified" | "rejected";
    reviewerNote?: string;
  };
  if (!body.userId || (body.status !== "verified" && body.status !== "rejected")) {
    return Response.json({ error: "userId and status required" }, { status: 400 });
  }
  await ensureCommunitySchema();
  const db = getDb();
  await db
    .update(orgProfiles)
    .set({
      status: body.status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: gate.user!.email,
      reviewerNote: body.reviewerNote?.trim() || null,
    })
    .where(eq(orgProfiles.userId, body.userId));
  return Response.json({ ok: true });
}
