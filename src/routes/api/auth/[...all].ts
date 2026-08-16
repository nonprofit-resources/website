import { auth } from "~/lib/auth";
import { ensureCommunitySchema } from "~/lib/db";

export async function GET(event: { request: Request }) {
  await ensureCommunitySchema();
  return auth.handler(event.request);
}

export async function POST(event: { request: Request }) {
  await ensureCommunitySchema();
  return auth.handler(event.request);
}
