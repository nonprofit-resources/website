import { eq } from "drizzle-orm";
import { orgProfiles } from "~/lib/schema";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "~/lib/db";
import { getSessionUser } from "~/lib/session";

export async function GET(event: { request: Request }) {
  const user = await getSessionUser(event.request);
  if (!user) return Response.json({ error: "Sign in first" }, { status: 401 });
  if (!hasCommunityDb()) return Response.json({ status: "unverified", db: false });
  await ensureCommunitySchema();
  const db = getDb();
  const [row] = await db.select().from(orgProfiles).where(eq(orgProfiles.userId, user.id));
  return Response.json({
    db: true,
    status: row?.status ?? "unverified",
    orgName: row?.orgName ?? "",
    ein: row?.ein ?? "",
    orgWebsite: row?.orgWebsite ?? "",
    evidenceNote: row?.evidenceNote ?? "",
    displayName: row?.displayName ?? user.name ?? "",
    reviewerNote: row?.reviewerNote ?? "",
  });
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
    orgName?: string;
    ein?: string;
    orgWebsite?: string;
    evidenceNote?: string;
    displayName?: string;
  };
  if (!body.orgName?.trim()) {
    return Response.json({ error: "Organization name is required" }, { status: 400 });
  }
  await ensureCommunitySchema();
  const db = getDb();
  const now = new Date().toISOString();
  const [existing] = await db.select().from(orgProfiles).where(eq(orgProfiles.userId, user.id));
  const values = {
    userId: user.id,
    email: user.email ?? "",
    displayName: body.displayName?.trim() || user.name || null,
    orgName: body.orgName.trim(),
    ein: body.ein?.trim() || null,
    orgWebsite: body.orgWebsite?.trim() || null,
    evidenceNote: body.evidenceNote?.trim() || null,
    status: "pending" as const,
    submittedAt: now,
  };
  if (existing && existing.status === "verified") {
    return Response.json({ error: "Already verified" }, { status: 409 });
  }
  if (existing) {
    await db.update(orgProfiles).set(values).where(eq(orgProfiles.userId, user.id));
  } else {
    await db.insert(orgProfiles).values(values);
  }
  return Response.json({ ok: true, status: "pending" });
}
