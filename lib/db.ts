import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _sql: NeonQueryFunction<false, false> | null = null;
let _schemaReady: Promise<void> | null = null;

function connect() {
  if (_db && _sql) return { db: _db, sql: _sql };
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const sql = neon(url);
  const db = drizzle(sql, { schema });
  _sql = sql;
  _db = db;
  return { db, sql };
}

export function getDb() {
  return connect()?.db ?? null;
}

// Idempotent runtime migration. Runs on first DB use per cold start so the
// Vercel Neon integration "just works" without a manual `db:push`.
export async function ensureSchema(): Promise<void> {
  const conn = connect();
  if (!conn) throw new Error("DATABASE_URL not set");
  if (_schemaReady) return _schemaReady;
  const { sql } = conn;
  _schemaReady = (async () => {
    try {
      await sql`CREATE TABLE IF NOT EXISTS "roadmap" (
        "id" serial PRIMARY KEY NOT NULL,
        "year" text NOT NULL,
        "title_ar" text NOT NULL,
        "title_en" text NOT NULL,
        "desc_ar" text NOT NULL,
        "desc_en" text NOT NULL,
        "sort_order" integer DEFAULT 0 NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS "achievements" (
        "id" serial PRIMARY KEY NOT NULL,
        "year" text NOT NULL,
        "title_ar" text NOT NULL,
        "title_en" text NOT NULL,
        "desc_ar" text NOT NULL,
        "desc_en" text NOT NULL,
        "icon" text DEFAULT 'spark' NOT NULL,
        "sort_order" integer DEFAULT 0 NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS "site_settings" (
        "key" text PRIMARY KEY NOT NULL,
        "value" text NOT NULL
      )`;
      await sql`ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "image_url" text NOT NULL DEFAULT ''`;
      await sql`ALTER TABLE "achievements" ADD COLUMN IF NOT EXISTS "video_url" text NOT NULL DEFAULT ''`;
    } catch (err) {
      _schemaReady = null;
      throw err;
    }
  })();
  return _schemaReady;
}
