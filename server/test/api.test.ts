import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { openDb, type Db } from "../db.ts";
import { createApp } from "../app.ts";
import { normalisePhone, parseSignup } from "../validate.ts";

let db: Db;
let server: Server;
let base = "";

const good = {
  name: "  Asha   Verma ",
  phone: "98765 43210",
  email: "Asha@Example.com",
  city: "Bengaluru",
  parentCity: "Dehradun",
  parentAge: "70-79",
  interest: "pilot",
  message: "Maa lives alone.",
  lang: "en",
  consent: true,
};

const post = (body: unknown) =>
  fetch(`${base}/api/signups`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

before(async () => {
  db = await openDb(); // in-memory
  server = createApp(db, { signupLimit: 8 }).listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});
after(async () => {
  server.close();
  await db.close();
});

test("phone numbers are normalised", () => {
  assert.equal(normalisePhone("98765 43210"), "+919876543210");
  assert.equal(normalisePhone("+91-98765-43210"), "+919876543210");
  assert.equal(normalisePhone("09876543210"), "+919876543210");
  assert.equal(normalisePhone("919876543210"), "+919876543210");
  assert.equal(normalisePhone("+1 415 555 2671"), "+14155552671");
  assert.equal(normalisePhone("12345"), null);
  assert.equal(normalisePhone("5876543210"), null);
  assert.equal(normalisePhone("+91 12345 67890"), null);
  assert.equal(normalisePhone("98765abc10"), null);
});

test("validation reports required and invalid fields", () => {
  const r = parseSignup({ name: "", phone: "123", email: "nope", parentAge: "old", consent: false });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.errors.name, "required");
  assert.equal(r.errors.phone, "invalid");
  assert.equal(r.errors.email, "invalid");
  assert.equal(r.errors.city, "required");
  assert.equal(r.errors.parentAge, "invalid");
  assert.equal(r.errors.interest, "required");
  assert.equal(r.errors.consent, "required");
});

test("health and pilot endpoints respond", async () => {
  assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { ok: true, db: "pglite" });
  assert.deepEqual(await (await fetch(`${base}/api/pilot`)).json(), { total: 20, left: 20, open: true });
});

test("a valid sign-up is saved, trimmed and normalised", async () => {
  const res = await post(good);
  assert.equal(res.status, 201);
  const rows = await db.query<Record<string, string>>(`SELECT * FROM signups`);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Asha Verma");
  assert.equal(rows[0].phone, "+919876543210");
  assert.equal(rows[0].email, "asha@example.com");
  assert.equal(rows[0].parent_age, "70-79");
  assert.equal(rows[0].status, "new");
});

test("the same phone again updates instead of duplicating", async () => {
  const res = await post({ ...good, phone: "+91 9876543210", interest: "waitlist", email: "" });
  assert.equal(res.status, 201);
  const rows = await db.query<Record<string, string>>(`SELECT * FROM signups`);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].interest, "waitlist");
  assert.equal(rows[0].email, "");
});

test("invalid sign-ups are rejected and not saved", async () => {
  const res = await post({ ...good, phone: "12", consent: false });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.errors.phone, "invalid");
  assert.equal(body.errors.consent, "required");
  assert.equal((await db.query(`SELECT * FROM signups`)).length, 1);
});

test("the honeypot swallows bots without saving", async () => {
  const res = await post({ ...good, phone: "9123456780", website: "http://spam.example" });
  assert.equal(res.status, 200);
  assert.equal((await db.query(`SELECT * FROM signups`)).length, 1);
});

test("malformed JSON and unknown API routes fail cleanly", async () => {
  const bad = await fetch(`${base}/api/signups`, { method: "POST", headers: { "content-type": "application/json" }, body: "{oops" });
  assert.equal(bad.status, 400);
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
});

test("SQL in a field is stored as plain text", async () => {
  const res = await post({ ...good, phone: "9000000001", name: "Robert'); DROP TABLE signups;--" });
  assert.equal(res.status, 201);
  const rows = await db.query<{ name: string }>(`SELECT name FROM signups WHERE phone = '+919000000001'`);
  assert.equal(rows[0].name, "Robert'); DROP TABLE signups;--");
});

test("too many sign-ups from one visitor are rate limited", async () => {
  let last = 0;
  for (let i = 0; i < 6; i++) last = (await post({ ...good, phone: `90000001${10 + i}` })).status;
  assert.equal(last, 429);
});

test("security headers are set", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.match(res.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  assert.equal(res.headers.get("x-powered-by"), null);
});
