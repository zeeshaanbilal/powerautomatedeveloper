const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    for (const width of [320, 390, 768, 1024, 1191, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of [
        "/developers/",
        "/developers/our-team/",
        "/hire/",
        "/hire/power-automate-developer/",
      ]) {
        await page.goto("http://localhost:3000" + path, {
          waitUntil: "networkidle",
        });
        assert.ok(await page.locator(".developer-card").count());
        assert.equal(
          await page.locator(".site-header .brand").innerText(),
          "HASHTURN.",
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${path}: overflow ${width}`,
        );
        const overlap = await page.locator(".header-inner").evaluate((el) => {
          const items = [...el.children].filter(
            (e) => getComputedStyle(e).display !== "none",
          );
          return items.some(
            (e, i) =>
              i &&
              e.getBoundingClientRect().left <
                items[i - 1].getBoundingClientRect().right - 1,
          );
        });
        assert.ok(!overlap, `Header overlap ${width}`);
        if (
          (width === 390 || width === 1440) &&
          path === "/hire/power-automate-developer/"
        )
          await page
            .locator(".hiring-developers")
            .screenshot({ path: `artifacts/developer-cards-${width}.png` });
      }
      console.log(`Developer cards and logo passed at ${width}px`);
    }
    assert.deepEqual(errors, []);
    console.log("28 route/viewport checks passed. No page errors.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
