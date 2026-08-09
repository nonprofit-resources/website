import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let client: Client | null = null;
let db: LibSQLDatabase<typeof schema> | null = null;

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
