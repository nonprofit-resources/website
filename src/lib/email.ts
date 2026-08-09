export async function sendTransactionalEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "support@updates.nonprofit-resources.org";

  if (!key) {
    console.info("[resend] missing RESEND_API_KEY — log-only", opts.to, opts.subject);
    return { ok: true as const, mocked: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error ${res.status}: ${text}`);
  }
  return { ok: true as const, mocked: false };
}
