import { defineConfig } from "@playwright/test";

// Browser tests run against a fresh server with an in-memory database, so your real data is never touched.
export const E2E_SECRET = "e2e-admin-secret-123";
const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  outputDir: "test-results/output",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  timeout: 60_000,
  use: { baseURL: `http://localhost:${PORT}`, reducedMotion: "reduce" },
  webServer: {
    command: "npx tsx server/index.ts",
    port: PORT,
    reuseExistingServer: false,
    env: { PORT: String(PORT), PGLITE_DIR: "memory", ADMIN_SECRET: E2E_SECRET },
  },
});
