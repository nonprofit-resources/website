import { subscribeNewsEmail as subscribeCustomerIo } from "~/lib/customerio";
import { ensureCommunitySchema, getClient, hasCommunityDb } from "~/lib/db";

async function persistSubscriber(email: string, synced: boolean) {
  if (!hasCommunityDb()) return { ok: true as const, mocked: true };
  await ensureCommunitySchema();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await getClient().execute({
    sql: `INSERT INTO subscribers (id, email, created_at, source, cio_synced)
          VALUES (?, ?, ?, 'news', ?)
          ON CONFLICT(email) DO UPDATE SET cio_synced = excluded.cio_synced`,
    args: [id, email, now, synced ? 1 : 0],
  });
  return { ok: true as const, mocked: false };
}

async function subscribeResendAudience(email: string) {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_NEWS_AUDIENCE_ID;
  if (!key || !audienceId) {
    console.info("[resend] missing RESEND_API_KEY or RESEND_NEWS_AUDIENCE_ID — skip contact");
    return { ok: true as const, mocked: true };
  }

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (res.ok || res.status === 409) {
    return { ok: true as const, mocked: false };
  }
  const text = await res.text();
  throw new Error(`Resend error ${res.status}: ${text}`);
}

/** Persist locally, add to the Resend News audience, and optionally identify in Customer.io. */
export async function subscribeNewsEmail(email: string) {
  const resend = await subscribeResendAudience(email);
  let cio: { ok: true; mocked: boolean } = { ok: true, mocked: true };
  try {
    cio = await subscribeCustomerIo(email);
  } catch (err) {
    if (!resend.mocked) {
      console.info("[customerio] skipped after Resend subscribe", err);
    } else {
      throw err;
    }
  }
  const synced = !resend.mocked || !cio.mocked;
  try {
    const stored = await persistSubscriber(email, synced);
    return { ok: true as const, mocked: resend.mocked && cio.mocked && stored.mocked };
  } catch (err) {
    if (synced) {
      console.info("[subscribe] stored locally failed after provider sync", err);
      return { ok: true as const, mocked: false };
    }
    throw err;
  }
}
