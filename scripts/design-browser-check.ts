import { createPrismaClient } from "../lib/prisma-client";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const db = createPrismaClient();
const base = "http://localhost:3000";
const email = `design-check-${Date.now()}@example.com`;
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const failures: string[] = [];
  page.on("pageerror", (e) => failures.push(e.message));
  try {
    for (const width of [320, 390, 768, 1024, 1190, 1191, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of ["/blog/", "/blog/planning-your-first-automation/"]) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `Overflow: ${path} at ${width}`,
        );
        assert.equal(await page.locator("h1").count(), 1);
        const robots = await page
          .locator('meta[name="robots"]')
          .getAttribute("content");
        assert.ok(
          robots?.includes("noindex"),
          "Samples and a sample-only collection must remain noindex",
        );
      }
      await page.goto(base + "/", { waitUntil: "networkidle" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `Homepage overflow ${width}`,
      );
      assert.equal(
        await page.locator(".insights-section .image-card").count(),
        3,
      );
      const header = await page.locator(".header-inner").evaluate((el) => {
        const items = Array.from(el.children).filter(
          (e) => getComputedStyle(e).display !== "none",
        );
        return items.every(
          (e, i) =>
            !i ||
            e.getBoundingClientRect().left >=
              items[i - 1].getBoundingClientRect().right - 1,
        );
      });
      assert.ok(header, `Header items overlap at ${width}`);
      // Lazy images are checked after they enter the viewport.
      for (const img of await page.locator("main img").all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((el) => (el as HTMLImageElement).decode());
      }
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: `artifacts/design-home-${width}.png`,
          fullPage: true,
        });
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: `artifacts/design-hero-${width}.png` });
        await page
          .locator(".insights-section")
          .screenshot({ path: `artifacts/design-blog-cards-${width}.png` });
      }
      console.log(`Design checks passed at ${width}px.`);
    }
    const sitemap = await (await fetch(base + "/sitemap.xml")).text();
    assert.ok(!sitemap.includes("/blog/planning-your-first-automation/"));
    await page.goto(base + "/contact/", { waitUntil: "networkidle" });
    await page.getByLabel("Name", { exact: true }).fill("Design verification");
    await page.getByLabel("Business / company").fill("Website QA");
    await page.getByLabel("Work email").fill(email);
    await page
      .getByLabel("What kind of help do you need?")
      .selectOption("New automation project");
    await page
      .getByLabel("Tell us about your process")
      .fill(
        "Temporary website design verification enquiry. Remove after validation.",
      );
    await page.waitForTimeout(3000);
    await page
      .getByRole("button", { name: "Discuss Your Automation Project" })
      .click();
    await page
      .getByRole("heading", { name: "Your enquiry has been received." })
      .waitFor();
    const lead = await db.lead.findFirst({
      where: { email },
      select: { id: true },
    });
    assert.ok(lead, "The submitted enquiry must be saved");
    assert.deepEqual(failures, []);
    await writeFile(
      "artifacts/design-check.json",
      JSON.stringify(
        {
          viewports: 8,
          blogChecks: 16,
          headerChecks: 8,
          images: "decoded",
          samples: "noindex; excluded from sitemap",
          form: "browser submission saved in database; test enquiry removed",
          errors: failures,
        },
        null,
        2,
      ),
    );
    console.log(
      "Sample SEO, images, header layout and contact submission passed.",
    );
  } finally {
    await db.lead.deleteMany({ where: { email } });
    await browser.close();
    await db.$disconnect();
  }
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
