import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.AUDIT_URL || "http://localhost:3000";
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const checks: {
    path: string;
    width: number;
    overflow: boolean;
    h1: number;
  }[] = [];
  try {
    for (const width of [320, 375, 390, 414, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [
        "/",
        "/services/",
        "/services/power-automate-development/",
        "/hire/power-automate-team/",
        "/developers/zeeshan-bilal/",
        "/contact/",
        "/resources/",
      ]) {
        await page.goto(origin + path, { waitUntil: "networkidle" });
        const dimensions = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          width: innerWidth,
        }));
        checks.push({
          path,
          width,
          overflow: dimensions.scroll > dimensions.width + 1,
          h1: await page.locator("h1").count(),
        });
      }
      if (width === 390 || width === 1440) {
        await page.goto(origin + "/", { waitUntil: "networkidle" });
        await mkdir("artifacts", { recursive: true });
        await page.screenshot({
          path: `artifacts/home-${width}.png`,
          fullPage: true,
        });
        await page.screenshot({ path: `artifacts/home-${width}-viewport.png` });
      }
      console.log(`Checked ${width}px viewport.`);
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(origin + "/");
    await page.locator('summary[aria-label="Toggle navigation"]').click();
    if (
      !(await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .isVisible())
    )
      errors.push("Mobile menu did not open");
    const faq = page.locator(".faq-list details").first();
    await faq.locator("summary").click();
    if (!(await faq.getAttribute("open").then((v) => v !== null)))
      errors.push("FAQ did not open");
    await page.goto(origin + "/admin/");
    if (!page.url().includes("/admin/login"))
      errors.push("Admin did not redirect to login");
    const report = { checks, errors };
    await writeFile(
      "artifacts/browser-check.json",
      JSON.stringify(report, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          checks: checks.length,
          overflows: checks.filter((c) => c.overflow),
          headingFailures: checks.filter((c) => c.h1 !== 1),
          errors,
        },
        null,
        2,
      ),
    );
    if (errors.length || checks.some((c) => c.overflow || c.h1 !== 1))
      process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
