// Every public page, in both languages, at five screen widths: no sideways scrolling,
// no console errors, no broken images, a main heading, and an accessibility scan.
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/how-it-works", "/care-plan", "/pricing", "/why-saathi", "/our-story", "/faq", "/app-preview", "/join", "/contact", "/privacy", "/terms"];
const widths = [
  { name: "phone-375", width: 375, height: 812 },
  { name: "phone-414", width: 414, height: 896 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];
const langs = ["en", "hi"] as const;
const slug = (p: string) => (p === "/" ? "home" : p.slice(1));

async function open(page: Page, path: string, lang: "en" | "hi") {
  await page.addInitScript((l) => localStorage.setItem("saathi-lang", l), lang);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(path, { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  return errors;
}

for (const lang of langs) {
  for (const w of widths) {
    test.describe(`${lang} · ${w.name}`, () => {
      test.use({ viewport: { width: w.width, height: w.height } });
      for (const path of pages) {
        test(`${slug(path)}`, async ({ page }) => {
          const errors = await open(page, path, lang);
          await expect(page.locator("h1").first()).toBeVisible();

          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          expect(overflow, "page scrolls sideways").toBeLessThanOrEqual(0);

          const broken = await page.evaluate(() =>
            [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
          );
          expect(broken, "broken images").toEqual([]);

          // Text must not be cut off by its box (common with Hindi in tight buttons).
          const clipped = await page.evaluate(() =>
            [...document.querySelectorAll("button, a, h1, h2, h3, th, td")]
              .filter((el) => {
                if (el.clientWidth <= 1) return false; // visually hidden on purpose (e.g. "Skip to content")
                const s = getComputedStyle(el);
                if (s.overflow === "visible" && s.overflowX === "visible") return false;
                if (s.textOverflow === "ellipsis") return false;
                return el.scrollWidth > el.clientWidth + 1;
              })
              .map((el) => `${el.tagName}: ${(el.textContent ?? "").trim().slice(0, 40)}`),
          );
          expect(clipped, "clipped text").toEqual([]);

          await page.screenshot({ path: `test-results/screens/${lang}/${w.name}/${slug(path)}.png`, fullPage: true });
          expect(errors, "console errors").toEqual([]);
        });
      }
    });
  }
}

// One accessibility scan per page and language is enough: the markup is the same at every width.
for (const lang of langs) {
  test.describe(`accessibility · ${lang}`, () => {
    for (const path of pages) {
      test(`${slug(path)}`, async ({ page }) => {
        await open(page, path, lang);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const problems = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`,
        );
        expect(problems).toEqual([]);
      });
    }
  });
}
