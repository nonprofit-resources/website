"use server";

import { listVerifiedReviews, type ReviewsResult } from "~/lib/reviews";
import { getServiceById } from "~/lib/services-seed";

/**
 * Server function for offering pages. Runs in-process during SSR (no HTTP round trip to our own
 * /api/reviews, whose relative URL cannot be fetched on the server) and over RPC after hydration.
 * A database failure degrades to "no notes" instead of failing the whole page.
 */
export async function getOfferingReviews(serviceId: string): Promise<ReviewsResult> {
  if (!getServiceById(serviceId)) return { reviews: [], db: false };
  try {
    return await listVerifiedReviews(serviceId);
  } catch (err) {
    console.error("[reviews] could not load operator notes:", err instanceof Error ? err.message : String(err));
    return { reviews: [], db: false };
  }
}