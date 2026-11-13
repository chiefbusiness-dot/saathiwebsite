// Saathi web server: serves the API and the built website from one Node process.
import express from "express";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const app = express();
const port = Number(process.env.PORT) || 3000;
const webDir = fileURLToPath(new URL("../dist/web", import.meta.url));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

if (existsSync(webDir)) {
  app.use(express.static(webDir, { maxAge: "1h", index: false }));
  // Every non-API route returns the app; React Router handles the page.
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(`${webDir}/index.html`);
  });
}

app.listen(port, () => {
  console.log(`Saathi running at http://localhost:${port}`);
});
