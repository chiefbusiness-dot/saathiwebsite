// The Saathi web app: API routes plus the built website, in one Express app.
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { existsSync } from "node:fs";
import { getSettings, type Db } from "./db.ts";
import { parseSignup } from "./validate.ts";

export function createApp(db: Db, opts: { webDir?: string; signupLimit?: number } = {}) {
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
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
    }),
  );
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
    app.use(express.static(webDir, { index: false, maxAge: "1h" }));
    // Every other route returns the app; React Router shows the right page.
    app.get(/.*/, (_req, res) => {
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
