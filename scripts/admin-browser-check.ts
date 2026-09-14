import { chromium } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const base = process.env.AUDIT_URL || "http://localhost:3000";
async function main() {
  const credentials = await readFile(".admin-credentials.txt", "utf8");
  const email = credentials.match(/^Email: (.+)$/m)?.[1];
  const password = credentials.match(/^Password: (.+)$/m)?.[1];
  if (!email || !password)
    throw Error("Missing local administrator credentials");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const errors: string[] = [];
  const checks: { width: number; path: string; overflow: boolean }[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  try {
    await page.goto(base + "/admin/login/", { waitUntil: "networkidle" });
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL(base + "/admin/", { timeout: 20000 });
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [
        "/admin/",
        "/admin/content/",
        "/admin/content/new/?kind=BLOG",
        "/admin/media/",
        "/admin/settings/",
        "/admin/seo-audit/",
      ]) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        checks.push({
          width,
          path,
          overflow: await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
        });
      }
      await page.goto(base + "/admin/", { waitUntil: "networkidle" });
      await mkdir("artifacts", { recursive: true });
      await page.screenshot({ path: `artifacts/admin-${width}.png` });
    }
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.waitForURL(base + "/admin/login/");
    const report = { checks, errors };
    await writeFile(
      "artifacts/admin-browser-check.json",
      JSON.stringify(report, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          checks: checks.length,
          overflows: checks.filter((check) => check.overflow),
          errors,
        },
        null,
        2,
      ),
    );
    if (errors.length || checks.some((check) => check.overflow))
      process.exitCode = 1;
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
