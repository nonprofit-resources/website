import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { webhookEndpoints } from "./schema";
import { ensureCommunitySchema, getDb, hasCommunityDb } from "./db";

export const CATALOG_EVENTS = ["catalog.updated"] as const;
export type CatalogEvent = (typeof CATALOG_EVENTS)[number];

export function newWebhookSecret() {
  return randomBytes(24).toString("hex");
}

export function signPayload(secret: string, body: string) {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

export function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyGithubSignature(secret: string, raw: string, header: string | null) {
  if (!header || !header.startsWith("sha256=")) return false;
  const expected = signPayload(secret, raw);
  return safeEqualHex(header, expected);
}

const blockedHosts = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.|0\.|\[::1\])/;

export function assertPublicHttpsUrl(url: string, { allowLocal = false } = {}) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid webhook URL");
  }
  if (parsed.protocol !== "https:" && !(allowLocal && parsed.protocol === "http:")) {
    throw new Error("Webhook URL must be HTTPS");
  }
  if (!allowLocal && blockedHosts.test(parsed.hostname)) {
    throw new Error("Webhook URL must not target a private host");
  }
  return parsed.toString();
}

export async function listWebhookEndpoints() {
  if (!hasCommunityDb()) return [];
  await ensureCommunitySchema();
  return getDb().select().from(webhookEndpoints);
}

export async function createWebhookEndpoint(input: {
  url: string;
  events?: string[];
  note?: string;
}) {
  if (!hasCommunityDb()) throw new Error("Database is not attached");
  await ensureCommunitySchema();
  const allowLocal = (process.env.SITE_URL ?? "").includes("localhost");
  const url = assertPublicHttpsUrl(input.url, { allowLocal });
  const events = (input.events?.length ? input.events : ["catalog.updated"]).filter((e) =>
    (CATALOG_EVENTS as readonly string[]).includes(e),
  );
  if (!events.length) throw new Error("No valid events");
  const id = randomBytes(12).toString("hex");
  const secret = newWebhookSecret();
  const now = new Date().toISOString();
  await getDb()
    .insert(webhookEndpoints)
    .values({
      id,
      url,
      secret,
      eventsJson: JSON.stringify(events),
      createdAt: now,
      note: input.note ?? null,
    });
  return { id, url, secret, events };
}

export async function deleteWebhookEndpoint(id: string) {
  if (!hasCommunityDb()) throw new Error("Database is not attached");
  await ensureCommunitySchema();
  await getDb().delete(webhookEndpoints).where(eq(webhookEndpoints.id, id));
}

export async function dispatchCatalogUpdated(reason: string) {
  const payload = {
    event: "catalog.updated" as const,
    reason,
    catalog: `${process.env.SITE_URL ?? "https://nonprofit-resources.org"}/api/catalog`,
    occurredAt: new Date().toISOString(),
  };
  const body = JSON.stringify(payload);
  if (!hasCommunityDb()) return { delivered: 0, skipped: true };
  await ensureCommunitySchema();
  const rows = await getDb().select().from(webhookEndpoints);
  let delivered = 0;
  for (const row of rows) {
    if (row.disabled) continue;
    const events: string[] = JSON.parse(row.eventsJson || "[]");
    if (!events.includes("catalog.updated")) continue;
    const sig = signPayload(row.secret, body);
    try {
      const res = await fetch(row.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "nonprofit-resources-webhooks/0.1",
          "X-Nonprofit-Resources-Event": "catalog.updated",
          "X-Nonprofit-Resources-Signature": sig,
        },
        body,
        signal: AbortSignal.timeout(8000),
      });
      await getDb()
        .update(webhookEndpoints)
        .set({ lastDeliveryAt: payload.occurredAt, lastStatus: res.status, disabled: false })
        .where(eq(webhookEndpoints.id, row.id));
      if (res.ok) delivered++;
    } catch {
      await getDb()
        .update(webhookEndpoints)
        .set({ lastDeliveryAt: payload.occurredAt, lastStatus: 0 })
        .where(eq(webhookEndpoints.id, row.id));
    }
  }
  return { delivered, skipped: false };
}
