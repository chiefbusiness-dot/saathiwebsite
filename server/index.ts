// Starts the Saathi server.
import { fileURLToPath } from "node:url";
import { openDb } from "./db.ts";
import { createApp } from "./app.ts";

const port = Number(process.env.PORT) || 3000;
const webDir = fileURLToPath(new URL("../dist/web", import.meta.url));
const dataDir = fileURLToPath(new URL("../.pglite", import.meta.url));

const db = await openDb({ url: process.env.DATABASE_URL, dataDir });
const app = createApp(db, { webDir });

app.listen(port, () => {
  console.log(`Saathi running at http://localhost:${port} (database: ${db.kind})`);
});
