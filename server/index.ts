// Starts the Saathi server.
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { openDb } from "./db.ts";
import { createApp } from "./app.ts";

const production = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 3000;
const webDir = fileURLToPath(new URL("../dist/web", import.meta.url));
// PGLITE_DIR=memory keeps data in memory only (used by the browser tests).
const dataDir =
  process.env.PGLITE_DIR === "memory" ? undefined : (process.env.PGLITE_DIR ?? fileURLToPath(new URL("../.pglite", import.meta.url)));
const secretFile = fileURLToPath(new URL("../.admin-secret", import.meta.url));

/**
 * The owner's admin password. Online it must come from the ADMIN_SECRET setting.
 * On your own computer, if none is set, one is created once and kept in the .admin-secret file.
 */
function adminSecret(): string | null {
  const env = process.env.ADMIN_SECRET?.trim();
  if (env) {
    if (env.length >= 12) return env;
    console.warn("ADMIN_SECRET is shorter than 12 characters, so the admin page is switched off.");
    return null;
  }
  if (production) {
    console.warn("ADMIN_SECRET is not set, so the admin page is switched off.");
    return null;
  }
  if (!existsSync(secretFile)) writeFileSync(secretFile, randomBytes(12).toString("base64url") + "\n", { mode: 0o600 });
  console.log("Admin password for this computer is in the .admin-secret file.");
  return readFileSync(secretFile, "utf8").trim();
}

if (production && !process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Online, Saathi needs a real database (Supabase), or sign-ups would be lost on every restart.");
  process.exit(1);
}
const db = await openDb({ url: process.env.DATABASE_URL, dataDir });
const app = createApp(db, { webDir, adminSecret: adminSecret(), secureCookies: production });

app.listen(port, () => {
  console.log(`Saathi running at http://localhost:${port} (database: ${db.kind})`);
});
