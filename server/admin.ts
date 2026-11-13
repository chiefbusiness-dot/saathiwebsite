// Owner-only admin API under /api/admin. Sign-in uses ADMIN_SECRET; the session is a random
// token in an httpOnly cookie, stored only as a SHA-256 hash in the database.
import express, { type NextFunction, type Request, type Response } from "express";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { rateLimit } from "express-rate-limit";
import sharp from "sharp";
import { z } from "zod";
import { getSettings, type Db } from "./db.ts";

const COOKIE = "saathi_admin";
const SESSION_DAYS = 180;
export const IMAGE_SLOTS = ["story", "team"] as const;
const IMAGE_WIDTHS = [800, 1600];

const sha = (s: string) => createHash("sha256").update(s).digest();

function readCookie(req: Request, name: string): string | null {
  for (const part of (req.headers.cookie ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) {
      try {
        return decodeURIComponent(part.slice(i + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

const settingsSchema = z
  .object({
    pilot_total: z.number().int().min(0).max(1000),
    pilot_left: z.number().int().min(0).max(1000),
    pilot_open: z.boolean(),
    preview_visible: z.boolean(),
    watch_price: z.string().trim().min(1).max(20),
    plan_price: z.string().trim().min(1).max(20),
    contact_phone: z.string().trim().max(30),
    contact_email: z.union([z.literal(""), z.string().trim().max(120).pipe(z.email())]),
    contact_whatsapp: z.string().trim().max(30).regex(/^\+?[\d\s-]*$/),
    contact_address: z.string().trim().max(200),
  })
  .partial()
  .strict();

const overrides = z.record(z.string().regex(/^[A-Za-z0-9_.-]{1,120}$/), z.string().max(5000));
const contentSchema = z.object({ en: overrides, hi: overrides }).strict();

const signupPatch = z
  .object({
    status: z.enum(["new", "contacted", "pilot", "not_a_fit"]),
    notes: z.string().max(5000),
  })
  .partial()
  .strict();

/** Stops spreadsheet apps from running a cell as a formula. */
function csvCell(v: unknown): string {
  let s = v instanceof Date ? v.toISOString() : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function adminRouter(db: Db, opts: { secret: string | null; secure: boolean; loginLimit?: number }) {
  const r = express.Router();
  const log = (action: string, detail = "") =>
    db.query(`INSERT INTO admin_log (action, detail) VALUES ($1, $2)`, [action, detail.slice(0, 500)]);

  // Changes must come from our own admin page: a cross-site form cannot send this header,
  // and the cookie is SameSite=Strict as well.
  r.use((req, res, next) => {
    if (req.method !== "GET" && req.get("x-saathi-admin") !== "1") {
      res.status(403).json({ ok: false, error: "forbidden" });
      return;
    }
    next();
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: opts.loginLimit ?? 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { ok: false, error: "rate_limited" },
  });

  r.get("/status", (_req, res) => {
    res.json({ enabled: Boolean(opts.secret) });
  });

  r.post("/login", loginLimiter, async (req, res) => {
    if (!opts.secret) {
      res.status(503).json({ ok: false, error: "admin_disabled" });
      return;
    }
    const given = typeof req.body?.secret === "string" ? req.body.secret : "";
    if (!timingSafeEqual(sha(given), sha(opts.secret))) {
      await log("login_failed", req.ip ?? "");
      res.status(401).json({ ok: false, error: "wrong_secret" });
      return;
    }
    const token = randomBytes(32).toString("base64url");
    await db.query(`INSERT INTO admin_sessions (token_hash, user_agent) VALUES ($1, $2)`, [
      sha(token).toString("hex"),
      (req.get("user-agent") ?? "").slice(0, 200),
    ]);
    res.cookie(COOKIE, token, {
      httpOnly: true,
      secure: opts.secure,
      sameSite: "strict",
      path: "/api/admin",
      maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    });
    await log("login");
    res.json({ ok: true });
  });

  async function auth(req: Request, res: Response, next: NextFunction) {
    const token = readCookie(req, COOKIE);
    if (token) {
      const rows = await db.query<{ id: number }>(
        `UPDATE admin_sessions SET last_seen = now()
         WHERE token_hash = $1 AND created_at > now() - make_interval(days => $2)
         RETURNING id`,
        [sha(token).toString("hex"), SESSION_DAYS],
      );
      if (rows.length) {
        res.locals.sessionId = rows[0].id;
        next();
        return;
      }
    }
    res.status(401).json({ ok: false, error: "not_signed_in" });
  }
  r.use(auth);

  r.get("/me", async (_req, res) => {
    const [{ n }] = await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM admin_sessions`);
    res.json({ ok: true, sessions: n });
  });

  r.post("/logout", async (_req, res) => {
    await db.query(`DELETE FROM admin_sessions WHERE id = $1`, [res.locals.sessionId]);
    res.clearCookie(COOKIE, { path: "/api/admin" });
    res.json({ ok: true });
  });

  r.post("/logout-all", async (_req, res) => {
    await db.query(`DELETE FROM admin_sessions`);
    await log("logout_everywhere");
    res.clearCookie(COOKIE, { path: "/api/admin" });
    res.json({ ok: true });
  });

  /* ---------- Overview ---------- */
  r.get("/stats", async (_req, res) => {
    const [row] = await db.query<Record<string, number>>(`
      SELECT count(*)::int AS total,
        count(*) FILTER (WHERE interest = 'pilot')::int AS pilot,
        count(*) FILTER (WHERE interest = 'waitlist')::int AS waitlist,
        count(*) FILTER (WHERE status = 'new')::int AS new,
        count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week
      FROM signups`);
    res.json(row);
  });

  /* ---------- Sign-ups ---------- */
  const listSignups = async (q: Record<string, unknown>) => {
    const where: string[] = [];
    const params: unknown[] = [];
    if (typeof q.q === "string" && q.q.trim()) {
      params.push(`%${q.q.trim().toLowerCase()}%`);
      where.push(
        `(lower(name) LIKE $${params.length} OR phone LIKE $${params.length} OR lower(email) LIKE $${params.length}
          OR lower(city) LIKE $${params.length} OR lower(parent_city) LIKE $${params.length})`,
      );
    }
    for (const col of ["status", "interest"] as const) {
      if (typeof q[col] === "string" && q[col]) {
        params.push(q[col]);
        where.push(`${col} = $${params.length}`);
      }
    }
    return db.query(
      `SELECT * FROM signups ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC LIMIT 2000`,
      params,
    );
  };

  r.get("/signups", async (req, res) => {
    res.json(await listSignups(req.query));
  });

  r.get("/signups.csv", async (req, res) => {
    const rows = await listSignups(req.query);
    const cols: [string, string][] = [
      ["created_at", "Signed up"],
      ["name", "Name"],
      ["phone", "Phone"],
      ["email", "Email"],
      ["city", "City"],
      ["parent_city", "Parent's city"],
      ["parent_age", "Parent's age"],
      ["interest", "Interested in"],
      ["status", "Status"],
      ["notes", "Notes"],
      ["message", "Message"],
      ["lang", "Language"],
    ];
    const lines = [cols.map(([, h]) => csvCell(h)).join(",")];
    for (const row of rows) lines.push(cols.map(([k]) => csvCell(row[k])).join(","));
    await log("export_csv", `${rows.length} rows`);
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename="saathi-signups-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send("﻿" + lines.join("\r\n")); // BOM so Excel reads Hindi correctly
  });

  r.patch("/signups/:id", async (req, res) => {
    const id = Number(req.params.id);
    const p = signupPatch.safeParse(req.body);
    if (!Number.isInteger(id) || !p.success || !Object.keys(p.data).length) {
      res.status(400).json({ ok: false, error: "invalid" });
      return;
    }
    const rows = await db.query(
      `UPDATE signups SET status = COALESCE($2, status), notes = COALESCE($3, notes), updated_at = now()
       WHERE id = $1 RETURNING *`,
      [id, p.data.status ?? null, p.data.notes ?? null],
    );
    if (!rows.length) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    if (p.data.status) await log("signup_status", `#${id} → ${p.data.status}`);
    res.json(rows[0]);
  });

  r.delete("/signups/:id", async (req, res) => {
    const id = Number(req.params.id);
    const rows = Number.isInteger(id) ? await db.query(`DELETE FROM signups WHERE id = $1 RETURNING id`, [id]) : [];
    if (!rows.length) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    await log("signup_deleted", `#${id}`);
    res.json({ ok: true });
  });

  /* ---------- Settings ---------- */
  r.get("/settings", async (_req, res) => {
    res.json(await getSettings(db));
  });

  r.put("/settings", async (req, res) => {
    const p = settingsSchema.safeParse(req.body);
    if (!p.success) {
      res.status(400).json({ ok: false, error: "invalid", fields: p.error.issues.map((i) => String(i.path[0])) });
      return;
    }
    const merged = { ...(await getSettings(db)), ...p.data };
    if (Number(merged.pilot_left) > Number(merged.pilot_total)) {
      res.status(400).json({ ok: false, error: "invalid", fields: ["pilot_left"] });
      return;
    }
    for (const [k, v] of Object.entries(p.data)) {
      await db.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2::jsonb) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [k, JSON.stringify(v)],
      );
    }
    await log("settings", Object.keys(p.data).join(", "));
    res.json(merged);
  });

  /* ---------- Site text ---------- */
  r.get("/content", async (_req, res) => {
    const versions = await db.query(
      `SELECT id, at, note, (SELECT count(*) FROM jsonb_object_keys(en))::int + (SELECT count(*) FROM jsonb_object_keys(hi))::int AS changes
       FROM content_versions ORDER BY id DESC LIMIT 50`,
    );
    const [current] = await db.query<{ en: object; hi: object }>(`SELECT en, hi FROM content_versions ORDER BY id DESC LIMIT 1`);
    res.json({ en: current?.en ?? {}, hi: current?.hi ?? {}, versions });
  });

  const saveContent = async (en: object, hi: object, note: string) => {
    await db.query(`INSERT INTO content_versions (en, hi, note) VALUES ($1::jsonb, $2::jsonb, $3)`, [
      JSON.stringify(en),
      JSON.stringify(hi),
      note,
    ]);
    // Keep the 50 most recent versions.
    await db.query(`DELETE FROM content_versions WHERE id NOT IN (SELECT id FROM content_versions ORDER BY id DESC LIMIT 50)`);
  };

  r.put("/content", async (req, res) => {
    const p = contentSchema.safeParse(req.body);
    if (!p.success || Object.keys(p.data.en).length + Object.keys(p.data.hi).length > 3000) {
      res.status(400).json({ ok: false, error: "invalid" });
      return;
    }
    await saveContent(p.data.en, p.data.hi, "Edited text");
    await log("content_saved", `${Object.keys(p.data.en).length} English, ${Object.keys(p.data.hi).length} Hindi changes`);
    res.json({ ok: true });
  });

  r.post("/content/restore/:id", async (req, res) => {
    const [v] = await db.query<{ en: object; hi: object; at: string }>(`SELECT en, hi, at FROM content_versions WHERE id = $1`, [
      Number(req.params.id) || 0,
    ]);
    if (!v) {
      res.status(404).json({ ok: false, error: "not_found" });
      return;
    }
    await saveContent(v.en, v.hi, `Restored version #${req.params.id}`);
    await log("content_restored", `#${req.params.id}`);
    res.json({ ok: true });
  });

  /* ---------- Photos ---------- */
  r.post(
    "/images/:slot",
    express.raw({ type: ["image/jpeg", "image/png", "image/webp"], limit: "10mb" }),
    async (req, res) => {
      const slot = req.params.slot as (typeof IMAGE_SLOTS)[number];
      if (!IMAGE_SLOTS.includes(slot) || !Buffer.isBuffer(req.body) || !req.body.length) {
        res.status(400).json({ ok: false, error: "invalid" });
        return;
      }
      let outputs: Buffer[];
      try {
        const meta = await sharp(req.body).metadata();
        if (!meta.width || !meta.height || meta.width < 400) {
          res.status(400).json({ ok: false, error: "too_small" });
          return;
        }
        // Re-encoding also strips camera data such as GPS location from the file.
        outputs = await Promise.all(
          IMAGE_WIDTHS.map((w) => sharp(req.body).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()),
        );
      } catch {
        res.status(400).json({ ok: false, error: "not_an_image" });
        return;
      }
      const version = Date.now();
      await db.query(`DELETE FROM images WHERE slot = $1`, [slot]);
      for (let i = 0; i < IMAGE_WIDTHS.length; i++) {
        await db.query(`INSERT INTO images (slot, width, version, data) VALUES ($1, $2, $3, $4)`, [
          slot,
          IMAGE_WIDTHS[i],
          version,
          outputs[i],
        ]);
      }
      await log("photo_uploaded", slot);
      res.json({ ok: true, version });
    },
  );

  r.delete("/images/:slot", async (req, res) => {
    await db.query(`DELETE FROM images WHERE slot = $1`, [req.params.slot]);
    await log("photo_removed", req.params.slot);
    res.json({ ok: true });
  });

  /* ---------- Activity ---------- */
  r.get("/log", async (_req, res) => {
    res.json(await db.query(`SELECT * FROM admin_log ORDER BY id DESC LIMIT 200`));
  });

  return r;
}
