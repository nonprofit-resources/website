import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let client: Client | null = null;
let db: LibSQLDatabase<typeof schema> | null = null;
let communityReady: Promise<void> | null = null;

export function getClient() {
  if (client) return client;
  getDb();
  if (!client) throw new Error("libSQL client not initialized");
  return client;
}

export function getDb() {
  if (db) return db;
  const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
  db = drizzle(client, { schema });
  return db;
}

export function hasRemoteDb() {
  const url = process.env.TURSO_DATABASE_URL ?? "";
  return url.startsWith("libsql://") || url.startsWith("https://");
}

/** Reviews / human verification persist only on Turso (prod) or local file sqlite. */
export function hasCommunityDb() {
  if (hasRemoteDb()) return true;
  const hosted = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const url = process.env.TURSO_DATABASE_URL ?? "file:./data/local.db";
  return url.startsWith("file:") && !hosted;
}

export async function ensureCommunitySchema() {
  if (!communityReady) {
    communityReady = (async () => {
      const c = getClient();
      await c.execute(`
        CREATE TABLE IF NOT EXISTS "user" (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          email_verified INTEGER NOT NULL DEFAULT 0,
          image TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      await c.execute(`
        CREATE TABLE IF NOT EXISTS session (
          id TEXT PRIMARY KEY NOT NULL,
          expires_at INTEGER NOT NULL,
          token TEXT NOT NULL UNIQUE,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
        )
      `);
      await c.execute(`CREATE INDEX IF NOT EXISTS session_userId_idx ON session (user_id)`);
      await c.execute(`
        CREATE TABLE IF NOT EXISTS account (
          id TEXT PRIMARY KEY NOT NULL,
          account_id TEXT NOT NULL,
          provider_id TEXT NOT NULL,
          user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
          access_token TEXT,
          refresh_token TEXT,
          id_token TEXT,
          access_token_expires_at INTEGER,
          refresh_token_expires_at INTEGER,
          scope TEXT,
          password TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      await c.execute(`CREATE INDEX IF NOT EXISTS account_userId_idx ON account (user_id)`);
      await c.execute(`
        CREATE TABLE IF NOT EXISTS verification (
          id TEXT PRIMARY KEY NOT NULL,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      await c.execute(
        `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification (identifier)`,
      );
      await c.execute(`
        CREATE TABLE IF NOT EXISTS org_profiles (
          user_id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          display_name TEXT,
          org_name TEXT,
          ein TEXT,
          org_website TEXT,
          evidence_note TEXT,
          status TEXT NOT NULL DEFAULT 'unverified',
          submitted_at TEXT,
          reviewed_at TEXT,
          reviewed_by TEXT,
          reviewer_note TEXT
        )
      `);
      await c.execute(`
        CREATE TABLE IF NOT EXISTS offering_reviews (
          id TEXT PRIMARY KEY,
          service_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          body TEXT NOT NULL,
          rating INTEGER,
          created_at TEXT NOT NULL
        )
      `);
      await c.execute(
        `CREATE INDEX IF NOT EXISTS reviews_service_idx ON offering_reviews (service_id)`,
      );
      await c.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          created_at TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'news',
          cio_synced INTEGER NOT NULL DEFAULT 0
        )
      `);
      await c.execute(`
        CREATE TABLE IF NOT EXISTS webhook_endpoints (
          id TEXT PRIMARY KEY,
          url TEXT NOT NULL,
          secret TEXT NOT NULL,
          events_json TEXT NOT NULL DEFAULT '["catalog.updated"]',
          created_at TEXT NOT NULL,
          last_delivery_at TEXT,
          last_status INTEGER,
          disabled INTEGER NOT NULL DEFAULT 0,
          note TEXT
        )
      `);
    })();
  }
  await communityReady;
}
