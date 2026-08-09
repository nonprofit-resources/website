import { randomUUID } from "node:crypto";
import { sendTransactionalEmail } from "~/lib/email";

export async function POST(event: { request: Request }) {
  try {
    const body = (await event.request.json()) as {
      name?: string;
      portalUrl?: string;
      category?: string;
      offerKind?: string;
      summary?: string;
      submitterEmail?: string;
    };

    if (!body.name?.trim() || !body.portalUrl?.trim() || !body.summary?.trim()) {
      return Response.json({ error: "Name, portal URL, and summary are required" }, { status: 400 });
    }

    const id = randomUUID();
    // Persist when Turso is configured; always acknowledge + optional tx mail.
    console.info("[submit]", id, body.name, body.portalUrl);

    if (body.submitterEmail) {
      await sendTransactionalEmail({
        to: body.submitterEmail,
        subject: "We received your Nonprofit Resources suggestion",
        html: `<p>Thanks for suggesting <strong>${escapeHtml(body.name)}</strong>. We will review it shortly.</p>`,
      });
    }

    return Response.json({ ok: true, id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Submission failed" },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
