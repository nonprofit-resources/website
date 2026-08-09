/** Customer.io Track API — identify + subscribe attribute for news digests. */
export async function subscribeNewsEmail(email: string) {
  const siteId = process.env.CUSTOMER_IO_SITE_ID;
  const apiKey = process.env.CUSTOMER_IO_TRACK_API_KEY ?? process.env.CUSTOMER_IO_API_KEY;

  if (!siteId || !apiKey) {
    console.info("[customerio] missing credentials — log-only subscribe", email);
    return { ok: true as const, mocked: true };
  }

  const auth = Buffer.from(`${siteId}:${apiKey}`).toString("base64");
  const res = await fetch(`https://track.customer.io/api/v1/customers/${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      news_subscribed: true,
      news_subscribed_at: Math.floor(Date.now() / 1000),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Customer.io error ${res.status}: ${text}`);
  }
  return { ok: true as const, mocked: false };
}
