import { eq } from "drizzle-orm";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "~/lib/db";
import { offeringReviews, orgProfiles } from "~/lib/schema";

export interface ReviewRow {
  id: string;
  body: string;
  rating: number | null;
  createdAt: string;
  orgName: string | null;
  displayName: string | null;
}

export interface ReviewsResult {
  reviews: ReviewRow[];
  db: boolean;
}

/** Public operator notes for one offering: only notes from human-verified org accounts, newest first. */
export async function listVerifiedReviews(serviceId: string): Promise<ReviewsResult> {
  if (!hasCommunityDb()) return { reviews: [], db: false };
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
  return { reviews, db: true };
}