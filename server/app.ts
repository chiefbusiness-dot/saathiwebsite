// The Saathi web app: API routes plus the built website, in one Express app.
import express from "express";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { existsSync } from "node:fs";
import { getSettings, type Db } from "./db.ts";
import { parseSignup } from "./validate.ts";
import { adminRouter, IMAGE_SLOTS } from "./admin.ts";

export function createApp(
  db: Db,
  opts: { webDir?: string; signupLimit?: number; adminSecret?: string | null; secureCookies?: boolean; loginLimit?: number } = {},
) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Render sits behind one proxy; needed for correct visitor IPs.

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // animations set inline styles
          imgSrc: ["'self'", "data:", "blob:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, db: db.kind });
  });

  // How many pilot places are left. Shown on the website; edited from the admin page.
  app.get("/api/pilot", async (_req, res) => {
    const s = await getSettings(db);
    const total = Number(s.pilot_total) || 0;
    const left = Math.max(0, Math.min(total, Number(s.pilot_left) || 0));
    res.json({ total, left, open: Boolean(s.pilot_open) && left > 0 });
  });

  // Everything the public site needs that the owner can change: text overrides, prices,
  // switches, contact details and photo versions.
  app.get("/api/site", async (_req, res) => {
    const s = await getSettings(db);
    const [content] = await db.query<{ en: object; hi: object }>(`SELECT en, hi FROM content_versions ORDER BY id DESC LIMIT 1`);
    const imgs = await db.query<{ slot: string; v: string }>(`SELECT slot, max(version)::text AS v FROM images GROUP BY slot`);
    res.set("Cache-Control", "no-cache");
    res.json({
      settings: {
        pilot_open: Boolean(s.pilot_open),
        preview_visible: Boolean(s.preview_visible),
        watch_price: String(s.watch_price),
        plan_price: String(s.plan_price),
        contact_phone: String(s.contact_phone),
        contact_email: String(s.contact_email),
        contact_whatsapp: String(s.contact_whatsapp),
        contact_address: String(s.contact_address),
      },
      content: { en: content?.en ?? {}, hi: content?.hi ?? {} },
      images: Object.fromEntries(imgs.map((i) => [i.slot, i.v])),
    });
  });

  app.get("/api/images/:slot", async (req, res) => {
    const slot = req.params.slot;
    const want = Number(req.query.w) || 1600;
    if (!(IMAGE_SLOTS as readonly string[]).includes(slot)) {
      res.status(404).end();
      return;
    }
    const rows = await db.query<{ data: Uint8Array; version: string }>(
      `SELECT data, version::text AS version FROM images WHERE slot = $1 ORDER BY abs(width - $2) LIMIT 1`,
      [slot, want],
    );
    if (!rows.length) {
      res.status(404).end();
      return;
    }
    res.set("Content-Type", "image/webp");
    // A new upload gets a new ?v=, so old copies can be cached for a long time.
    res.set("Cache-Control", req.query.v === rows[0].version ? "public, max-age=31536000, immutable" : "no-cache");
    res.send(Buffer.from(rows[0].data));
  });

  app.use(
    "/api/admin",
    adminRouter(db, { secret: opts.adminSecret ?? null, secure: opts.secureCookies ?? false, loginLimit: opts.loginLimit }),
  );

  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: opts.signupLimit ?? 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { ok: false, error: "rate_limited" },
  });

  app.post("/api/signups", signupLimiter, async (req, res) => {
    // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
    if (typeof req.body?.website === "string" && req.body.website.trim() !== "") {
      res.json({ ok: true });
      return;
    }
    const parsed = parseSignup(req.body);
    if (!parsed.ok) {
      res.status(400).json({ ok: false, error: "invalid", errors: parsed.errors });
      return;
    }
    const d = parsed.data;
    // When the pilot is full or closed, new interest goes on the waitlist.
    const pilot = await getSettings(db);
    if (d.interest === "pilot" && (!pilot.pilot_open || Number(pilot.pilot_left) <= 0)) d.interest = "waitlist";
    // The same phone signing up again updates their entry instead of creating a duplicate.
    await db.query(
      `INSERT INTO signups (name, phone, email, city, parent_city, parent_age, interest, message, lang)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (phone) DO UPDATE SET
         name = EXCLUDED.name, email = EXCLUDED.email, city = EXCLUDED.city,
         parent_city = EXCLUDED.parent_city, parent_age = EXCLUDED.parent_age,
         interest = EXCLUDED.interest, message = EXCLUDED.message, lang = EXCLUDED.lang,
         updated_at = now()`,
      [d.name, d.phone, d.email, d.city, d.parentCity, d.parentAge, d.interest, d.message, d.lang],
    );
    res.status(201).json({ ok: true });
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ ok: false, error: "not_found" });
  });

  const webDir = opts.webDir;
  if (webDir && existsSync(webDir)) {
    // Files in /assets have a fingerprint in their name, so browsers can keep them for a year.
    app.use("/assets", express.static(`${webDir}/assets`, { index: false, maxAge: "365d", immutable: true }));
    app.use(express.static(webDir, { index: false, maxAge: "1h" }));
    // Every other route returns the app; React Router shows the right page.
    app.get(/.*/, (_req, res) => {
      res.set("Cache-Control", "no-cache");
      res.sendFile(`${webDir}/index.html`);
    });
  }

  // Last resort: never leak error details to visitors.
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = (err as { status?: number })?.status;
    if (status && status >= 400 && status < 500) {
      res.status(status).json({ ok: false, error: "bad_request" });
      return;
    }
    console.error(err);
    res.status(500).json({ ok: false, error: "server_error" });
  });

  return app;
}
