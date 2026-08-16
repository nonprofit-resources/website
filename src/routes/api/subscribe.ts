import { subscribeNewsEmail } from "~/lib/news-subscribe";

export async function POST(event: { request: Request }) {
  try {
    const body = (await event.request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }
    const result = await subscribeNewsEmail(email);
    return Response.json({ ok: true, mocked: result.mocked });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Subscribe failed" },
      { status: 500 },
    );
  }
}
