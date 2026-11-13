// Database access. Uses real Postgres when DATABASE_URL is set (Supabase in production),
// and an embedded Postgres (PGlite) stored in ./.pglite otherwise, so local runs need no setup.
import pg from "pg";
import { PGlite } from "@electric-sql/pglite";

export type Db = {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<T[]>;
  close: () => Promise<void>;
  kind: "postgres" | "pglite";
};

export async function openDb(opts: { url?: string; dataDir?: string } = {}): Promise<Db> {
  let db: Db;
  if (opts.url) {
    const local = /localhost|127\.0\.0\.1/.test(opts.url);
    const pool = new pg.Pool({ connectionString: opts.url, ssl: local ? undefined : { rejectUnauthorized: false }, max: 5 });
    db = {
      kind: "postgres",
      query: async (sql, params) => (await pool.query(sql, params as unknown[])).rows,
      close: () => pool.end(),
    };
  } else {
    // No dataDir means in-memory, which the tests use.
    const lite = new PGlite(opts.dataDir);
    db = {
      kind: "pglite",
      query: async (sql, params) => (await lite.query(sql, params as unknown[])).rows as never,
      close: () => lite.close(),
    };
  }
  await migrate(db);
  return db;
}

export const defaults: Record<string, unknown> = {
  pilot_total: 20,
  pilot_left: 20,
  pilot_open: true,
  preview_visible: true,
  watch_price: "₹9,999",
  plan_price: "₹199",
  contact_phone: "",
  contact_email: "",
  contact_whatsapp: "",
  contact_address: "",
};

async function migrate(db: Db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS signups (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL DEFAULT '',
      city TEXT NOT NULL,
      parent_city TEXT NOT NULL,
      parent_age TEXT NOT NULL,
      interest TEXT NOT NULL,
      message TEXT NOT NULL DEFAULT '',
      lang TEXT NOT NULL DEFAULT 'en',
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT ''
    )`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    )`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id SERIAL PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
      user_agent TEXT NOT NULL DEFAULT ''
    )`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_log (
      id SERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      action TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT ''
    )`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS content_versions (
      id SERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      en JSONB NOT NULL DEFAULT '{}'::jsonb,
      hi JSONB NOT NULL DEFAULT '{}'::jsonb,
      note TEXT NOT NULL DEFAULT ''
    )`);
  await db.query(`
    CREATE TABLE IF NOT EXISTS images (
      slot TEXT NOT NULL,
      width INT NOT NULL,
      version BIGINT NOT NULL,
      data BYTEA NOT NULL,
      PRIMARY KEY (slot, width)
    )`);
  for (const [key, value] of Object.entries(defaults)) {
    await db.query(`INSERT INTO settings (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO NOTHING`, [
      key,
      JSON.stringify(value),
    ]);
  }
}

export async function getSettings(db: Db): Promise<Record<string, unknown>> {
  const rows = await db.query<{ key: string; value: unknown }>(`SELECT key, value FROM settings`);
  return { ...defaults, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
}
