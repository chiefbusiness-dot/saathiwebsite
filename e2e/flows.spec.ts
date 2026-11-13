// The things people actually do: switch language, open the menu on a phone, play the
// fall demo, join the pilot, and run the admin page.
import { test, expect } from "@playwright/test";
import { E2E_SECRET } from "../playwright.config";

test.describe.configure({ mode: "serial" });

test("language switch changes the whole page and is remembered", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Someone");
  await page.getByRole("button", { name: "हिन्दी" }).click();
  await expect(page.locator("h1")).toContainText("जवाब");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.locator("h1")).toContainText("Someone");
});

test("phone menu opens, navigates and closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Care plan" }).click();
  await expect(page).toHaveURL(/\/care-plan$/);
  await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0);
});

test("the fall demo plays to the end and saves an alert", async ({ page }) => {
  await page.goto("/app-preview");
  await page.getByRole("button", { name: "Simulate a fall" }).click();
  await expect(page.getByText("Maa is in safe hands")).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Back to the app" }).click();
  await expect(page.getByText("Fall detected (demo)")).toBeVisible();
});

test("join form shows errors, then accepts a valid sign-up", async ({ page }) => {
  await page.goto("/join");
  await page.getByRole("button", { name: "Join the list" }).click();
  await expect(page.getByText("Please check the highlighted fields.")).toBeVisible();
  await expect(page.locator("#name")).toBeFocused();

  await page.locator("#name").fill("E2E Family");
  await page.locator("#phone").fill("98765 00001");
  await page.locator("#city").fill("Pune");
  await page.locator("#parentCity").fill("Dehradun");
  await page.locator("#parentAge").selectOption("80plus");
  await page.getByText("The waitlist", { exact: true }).click();
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Join the list" }).click();
  await expect(page.getByRole("heading", { name: "Thank you. You're on the list." })).toBeVisible();
});

test("admin: sign in, see the sign-up, change things, and see them on the site", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Admin password").fill("wrong");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("That password isn't right.")).toBeVisible();
  await page.getByLabel("Admin password").fill(E2E_SECRET);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();

  await page.getByRole("link", { name: "Sign-ups" }).click();
  await page.getByRole("button", { name: /E2E Family/ }).click();
  await expect(page.getByText("+919876500001")).toBeVisible();
  await page.getByLabel("Status for E2E Family").selectOption("contacted");
  await expect(page.getByRole("button", { name: /E2E Family/ })).toContainText("Contacted");

  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download spreadsheet" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^saathi-signups-.*\.csv$/);

  await page.getByRole("link", { name: "Prices & settings" }).click();
  await page.getByLabel("Places left").fill("7");
  await page.getByLabel("Watch price (one-time)").fill("₹8,499");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved. The site is updated.")).toBeVisible();

  await page.getByRole("link", { name: "Site text" }).click();
  await page.getByLabel("Find text").fill("Be one of our first 20 families.");
  await page.locator("textarea").first().fill("Be one of our first families.");
  await page.getByRole("button", { name: "Save and publish" }).click();
  await expect(page.getByText("Saved. The changes are live on the site now.")).toBeVisible();

  await page.goto("/pricing");
  await expect(page.getByText("₹8,499").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Be one of our first families." })).toBeVisible();
  await page.goto("/join");
  await expect(page.getByText("7 of 20 pilot places left")).toBeVisible();

  await page.goto("/admin/activity");
  await expect(page.getByText("Edited site text")).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page.getByLabel("Admin password")).toBeVisible();
});
