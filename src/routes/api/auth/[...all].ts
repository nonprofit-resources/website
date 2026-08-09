import { auth } from "~/lib/auth";

export async function GET(event: { request: Request }) {
  return auth.handler(event.request);
}

export async function POST(event: { request: Request }) {
  return auth.handler(event.request);
}
