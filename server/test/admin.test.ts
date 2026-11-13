import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import sharp from "sharp";
import { openDb, type Db } from "../db.ts";
import { createApp } from "../app.ts";

const SECRET = "correct-horse-battery";
let db: Db;
let server: Server;
let base = "";
let cookie = "";

const api = (path: string, init: RequestInit & { json?: unknown; noHeader?: boolean; noCookie?: boolean } = {}) => {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  if (!init.noHeader) headers["x-saathi-admin"] = "1";
  if (cookie && !init.noCookie) headers.cookie = cookie;
  if (init.json !== undefined) headers["content-type"] = "application/json";
  return fetch(`${base}${path}`, { ...init, headers, body: init.json !== undefined ? JSON.stringify(init.json) : init.body });
};

before(async () => {
  db = await openDb();
  server = createApp(db, { adminSecret: SECRET, loginLimit: 6 }).listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
  for (const [name, phone, interest] of [
    ["Asha Verma", "+919876543210", "pilot"],
    ["=HYPERLINK(\"x\")", "+919876543211", "waitlist"],
  ]) {
    await db.query(
      `INSERT INTO signups (name, phone, city, parent_city, parent_age, interest) VALUES ($1,$2,'Pune','Dehradun','70-79',$3)`,
      [name, phone, interest],
    );
  }
});
after(async () => {
  server.close();
  await db.close();
});

test("admin data is locked without signing in", async () => {
  assert.equal((await api("/api/admin/signups")).status, 401);
  assert.equal((await api("/api/admin/settings", { method: "PUT", json: { pilot_left: 1 } })).status, 401);
});

test("a wrong secret is refused and logged", async () => {
  const res = await api("/api/admin/login", { method: "POST", json: { secret: "nope" } });
  assert.equal(res.status, 401);
  const [row] = await db.query<{ action: string }>(`SELECT action FROM admin_log ORDER BY id DESC LIMIT 1`);
  assert.equal(row.action, "login_failed");
});

test("requests without the admin header are refused", async () => {
  const res = await api("/api/admin/login", { method: "POST", json: { secret: SECRET }, noHeader: true });
  assert.equal(res.status, 403);
});

test("the right secret signs in with a secure, httpOnly cookie stored hashed", async () => {
  const res = await api("/api/admin/login", { method: "POST", json: { secret: SECRET } });
  assert.equal(res.status, 200);
  const set = res.headers.get("set-cookie") ?? "";
  assert.match(set, /saathi_admin=/);
  assert.match(set, /HttpOnly/i);
  assert.match(set, /SameSite=Strict/i);
  assert.match(set, /Path=\/api\/admin/);
  cookie = set.split(";")[0];
  const token = cookie.split("=")[1];
  const rows = await db.query<{ token_hash: string }>(`SELECT token_hash FROM admin_sessions`);
  assert.equal(rows.length, 1);
  assert.notEqual(rows[0].token_hash, token);
  assert.equal((await api("/api/admin/me")).status, 200);
});

test("stats and sign-up list work, with search and filters", async () => {
  const stats = await (await api("/api/admin/stats")).json();
  assert.deepEqual(stats, { total: 2, pilot: 1, waitlist: 1, new: 2, week: 2 });
  assert.equal((await (await api("/api/admin/signups")).json()).length, 2);
  const found = await (await api("/api/admin/signups?q=asha")).json();
  assert.equal(found.length, 1);
  assert.equal((await (await api("/api/admin/signups?interest=waitlist")).json()).length, 1);
});

test("status and notes can be updated, with bad values refused", async () => {
  const [row] = await db.query<{ id: number }>(`SELECT id FROM signups WHERE phone = '+919876543210'`);
  const ok = await api(`/api/admin/signups/${row.id}`, { method: "PATCH", json: { status: "contacted", notes: "Called on Monday" } });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).status, "contacted");
  assert.equal((await api(`/api/admin/signups/${row.id}`, { method: "PATCH", json: { status: "vip" } })).status, 400);
  assert.equal((await api(`/api/admin/signups/99999`, { method: "PATCH", json: { notes: "x" } })).status, 404);
});

test("CSV export has a BOM and neutralises spreadsheet formulas", async () => {
  const res = await api("/api/admin/signups.csv");
  assert.match(res.headers.get("content-type") ?? "", /text\/csv/);
  const bytes = Buffer.from(await res.arrayBuffer());
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf]); // UTF-8 BOM so Excel reads Hindi
  const text = bytes.toString("utf8");
  assert.match(text, /"Asha Verma"/);
  assert.match(text, /"'=HYPERLINK\(""x""\)"/);
});

test("settings save, validate, and reach the public site", async () => {
  const res = await api("/api/admin/settings", {
    method: "PUT",
    json: { pilot_left: 12, watch_price: "₹8,999", contact_whatsapp: "+91 98765 43210", preview_visible: false },
  });
  assert.equal(res.status, 200);
  assert.equal((await api("/api/admin/settings", { method: "PUT", json: { pilot_left: 50 } })).status, 400);
  assert.equal((await api("/api/admin/settings", { method: "PUT", json: { contact_email: "not-an-email" } })).status, 400);
  assert.equal((await api("/api/admin/settings", { method: "PUT", json: { made_up: 1 } })).status, 400);
  const site = await (await fetch(`${base}/api/site`)).json();
  assert.equal(site.settings.watch_price, "₹8,999");
  assert.equal(site.settings.preview_visible, false);
  assert.equal(site.settings.contact_whatsapp, "+91 98765 43210");
  assert.deepEqual(await (await fetch(`${base}/api/pilot`)).json(), { total: 20, left: 12, open: true });
});

test("pilot sign-ups go to the waitlist when the pilot is closed", async () => {
  await api("/api/admin/settings", { method: "PUT", json: { pilot_open: false } });
  const res = await fetch(`${base}/api/signups`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Ravi",
      phone: "9123456789",
      city: "Delhi",
      parentCity: "Dehradun",
      parentAge: "80plus",
      interest: "pilot",
      consent: true,
    }),
  });
  assert.equal(res.status, 201);
  const [row] = await db.query<{ interest: string }>(`SELECT interest FROM signups WHERE phone = '+919123456789'`);
  assert.equal(row.interest, "waitlist");
  await api("/api/admin/settings", { method: "PUT", json: { pilot_open: true } });
});

test("text edits are versioned, published and can be restored", async () => {
  assert.equal((await api("/api/admin/content", { method: "PUT", json: { en: { "hero.lede": "New lede" }, hi: {} } })).status, 200);
  assert.equal((await api("/api/admin/content", { method: "PUT", json: { en: { "hero.lede": "Second" }, hi: { "hero.note": "नया" } } })).status, 200);
  assert.equal((await api("/api/admin/content", { method: "PUT", json: { en: { "bad path!": "x" }, hi: {} } })).status, 400);
  let site = await (await fetch(`${base}/api/site`)).json();
  assert.deepEqual(site.content, { en: { "hero.lede": "Second" }, hi: { "hero.note": "नया" } });

  const content = await (await api("/api/admin/content")).json();
  assert.equal(content.versions.length, 2);
  const first = content.versions[1].id;
  assert.equal((await api(`/api/admin/content/restore/${first}`, { method: "POST" })).status, 200);
  site = await (await fetch(`${base}/api/site`)).json();
  assert.deepEqual(site.content, { en: { "hero.lede": "New lede" }, hi: {} });
});

test("photos are resized to WebP, served with caching, and removable", async () => {
  const png = await sharp({ create: { width: 2400, height: 1600, channels: 3, background: "#0e8f7e" } }).png().toBuffer();
  const up = await api("/api/admin/images/story", { method: "POST", headers: { "content-type": "image/png" }, body: png });
  assert.equal(up.status, 200);
  const { version } = await up.json();

  const site = await (await fetch(`${base}/api/site`)).json();
  assert.equal(site.images.story, String(version));
  const img = await fetch(`${base}/api/images/story?w=800&v=${version}`);
  assert.equal(img.headers.get("content-type"), "image/webp");
  assert.match(img.headers.get("cache-control") ?? "", /immutable/);
  const meta = await sharp(Buffer.from(await img.arrayBuffer())).metadata();
  assert.equal(meta.format, "webp");
  assert.equal(meta.width, 800);

  const tiny = await sharp({ create: { width: 100, height: 100, channels: 3, background: "#fff" } }).png().toBuffer();
  assert.equal((await api("/api/admin/images/story", { method: "POST", headers: { "content-type": "image/png" }, body: tiny })).status, 400);
  assert.equal(
    (await api("/api/admin/images/story", { method: "POST", headers: { "content-type": "image/png" }, body: Buffer.from("not an image") })).status,
    400,
  );
  assert.equal((await api("/api/admin/images/nope", { method: "POST", headers: { "content-type": "image/png" }, body: png })).status, 400);

  assert.equal((await api("/api/admin/images/story", { method: "DELETE" })).status, 200);
  assert.equal((await fetch(`${base}/api/images/story`)).status, 404);
});

test("activity log records owner actions", async () => {
  const log = await (await api("/api/admin/log")).json();
  const actions = log.map((l: { action: string }) => l.action);
  for (const a of ["login", "settings", "content_saved", "content_restored", "photo_uploaded", "export_csv", "signup_status"]) {
    assert.ok(actions.includes(a), `missing ${a}`);
  }
});

test("deleting a sign-up works", async () => {
  const [row] = await db.query<{ id: number }>(`SELECT id FROM signups WHERE phone = '+919123456789'`);
  assert.equal((await api(`/api/admin/signups/${row.id}`, { method: "DELETE" })).status, 200);
  assert.equal((await api(`/api/admin/signups/${row.id}`, { method: "DELETE" })).status, 404);
});

test("log out everywhere ends every session", async () => {
  assert.equal((await api("/api/admin/logout-all", { method: "POST" })).status, 200);
  assert.equal((await api("/api/admin/me")).status, 401);
  assert.equal((await db.query(`SELECT * FROM admin_sessions`)).length, 0);
});

test("repeated wrong secrets are rate limited", async () => {
  let last = 0;
  for (let i = 0; i < 8; i++) last = (await api("/api/admin/login", { method: "POST", json: { secret: "x" }, noCookie: true })).status;
  assert.equal(last, 429);
});

test("the admin page is off when no secret is configured", async () => {
  const off = createApp(db, {}).listen(0);
  const url = `http://localhost:${(off.address() as AddressInfo).port}`;
  const res = await fetch(`${url}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-saathi-admin": "1" },
    body: JSON.stringify({ secret: "" }),
  });
  assert.equal(res.status, 503);
  off.close();
});
