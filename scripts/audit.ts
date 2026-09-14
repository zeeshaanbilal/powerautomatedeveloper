import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.AUDIT_URL || "http://localhost:3000";
type Issue = { url: string; issue: string };
const issues: Issue[] = [];
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const visited = new Set<string>();
const images = new Set<string>();
const anchors: { source: string; path: string; hash: string }[] = [];
const ids = new Map<string, Set<string>>();
const metadata = (html: string, name: string) => {
  const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]);
  return tags
    .filter((t) => new RegExp(`(?:name|property)="${name}"`).test(t))
    .map((t) => t.match(/content="([^"]*)"/)?.[1] || "");
};
const add = (url: string, issue: string) => issues.push({ url, issue });
async function run() {
  const sitemap = await fetch(base + "/sitemap.xml");
  const xml = await sitemap.text();
  if (!sitemap.ok || !xml.includes("<urlset"))
    add("/sitemap.xml", "Invalid sitemap response");
  const publicUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  if (new Set(publicUrls).size !== publicUrls.length)
    add("/sitemap.xml", "Duplicate URLs");
  if (publicUrls.some((u) => /^\/(admin|api)/.test(u)))
    add("/sitemap.xml", "Private URL exposed");
  const robots = await fetch(base + "/robots.txt");
  const robotText = await robots.text();
  if (
    !robots.ok ||
    !robotText.includes(
      "Sitemap: https://powerautomatedeveloper.com/sitemap.xml",
    ) ||
    !robotText.includes("Disallow: /admin/")
  )
    add("/robots.txt", "Missing required robots rules");
  const queue = [...publicUrls];
  while (queue.length) {
    const path = queue.shift()!;
    if (visited.has(path) || /^\/(admin|api|_next|uploads)/.test(path))
      continue;
    visited.add(path);
    const response = await fetch(base + path, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      const target = response.headers.get("location");
      if (target) {
        const url = new URL(target, base);
        if (url.origin === new URL(base).origin) queue.push(url.pathname);
      }
      continue;
    }
    if (!response.ok) {
      add(path, `HTTP ${response.status}`);
      continue;
    }
    const html = await response.text();
    if (!response.headers.get("content-type")?.includes("text/html")) continue;
    const noindex =
      metadata(html, "robots").some((v) => v.includes("noindex")) ||
      response.headers.get("x-robots-tag")?.includes("noindex");
    if (noindex && publicUrls.includes(path))
      add(path, "Sitemap URL has noindex");
    const h1 = [...html.matchAll(/<h1\b/g)];
    if (h1.length !== 1) add(path, `Expected one H1, found ${h1.length}`);
    const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
    if (canonical.length !== 1)
      add(path, `Expected one canonical, found ${canonical.length}`);
    else {
      const url = canonical[0][0].match(/href="([^"]+)"/)?.[1];
      if (
        !url?.startsWith("https://powerautomatedeveloper.com/") ||
        /[?#]/.test(url)
      )
        add(path, "Invalid canonical");
    }
    const title = [...html.matchAll(/<title>(.*?)<\/title>/g)].map((m) => m[1]);
    if (title.length !== 1 || !title[0])
      add(path, "Missing or multiple titles");
    else if (!noindex) {
      if (titles.has(title[0]))
        add(path, `Duplicate title with ${titles.get(title[0])}`);
      titles.set(title[0], path);
    }
    const description = metadata(html, "description");
    if (description.length !== 1 || !description[0])
      add(path, "Missing or multiple descriptions");
    else if (!noindex) {
      if (descriptions.has(description[0]))
        add(
          path,
          `Duplicate description with ${descriptions.get(description[0])}`,
        );
      descriptions.set(description[0], path);
    }
    for (const name of [
      "og:title",
      "og:description",
      "og:image",
      "og:url",
      "og:type",
    ])
      if (metadata(html, name).length !== 1)
        add(path, `Missing or duplicate ${name}`);
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    if (!schemas.length) add(path, "Missing structured data");
    for (const schema of schemas)
      try {
        JSON.parse(schema[1]);
      } catch {
        add(path, "Invalid JSON-LD");
      }
    ids.set(
      path,
      new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])),
    );
    for (const link of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
      const href = link[1].replaceAll("&amp;", "&");
      if (!href || href === "#") {
        add(path, "Empty link");
        continue;
      }
      if (
        (href.startsWith("/") && !href.startsWith("//")) ||
        href.startsWith("#")
      ) {
        const url = new URL(href, base + path);
        if (url.hash)
          anchors.push({
            source: path,
            path: url.pathname,
            hash: decodeURIComponent(url.hash.slice(1)),
          });
        if (!/\.[a-z0-9]+$/i.test(url.pathname)) queue.push(url.pathname);
      }
    }
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\balt="[^"]*"/.test(image[0]))
        add(path, "Image missing alt attribute");
      const src = image[0]
        .match(/\bsrc="([^"]*)"/)?.[1]
        .replaceAll("&amp;", "&");
      if (src?.startsWith("/")) images.add(src);
    }
    for (const name of ["og:image"])
      for (const img of metadata(html, name)) {
        const url = new URL(img, base);
        if (
          url.hostname === "powerautomatedeveloper.com" ||
          url.origin === new URL(base).origin
        )
          images.add(url.pathname + url.search);
      }
  }
  for (const image of images) {
    const r = await fetch(base + image);
    if (!r.ok || !r.headers.get("content-type")?.startsWith("image/"))
      add(image, `Broken image (${r.status})`);
  }
  for (const anchor of anchors)
    if (ids.has(anchor.path) && !ids.get(anchor.path)?.has(anchor.hash))
      add(anchor.source, `Missing anchor ${anchor.path}#${anchor.hash}`);
  const missing = await fetch(base + "/definitely-not-a-real-page/");
  if (missing.status !== 404)
    add("/definitely-not-a-real-page/", "Missing route did not return 404");
  const admin = await fetch(base + "/admin/", { redirect: "manual" });
  if (![303, 307, 308].includes(admin.status))
    add("/admin/", "Unauthenticated admin did not redirect");
  const adminApi = await fetch(base + "/api/admin/content/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (adminApi.status !== 401)
    add("/api/admin/content/", "Unauthenticated mutation was not rejected");
  const report = {
    base,
    checkedAt: new Date().toISOString(),
    pages: visited.size,
    sitemapUrls: publicUrls.length,
    images: images.size,
    issues,
  };
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/seo-audit.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (issues.length) process.exitCode = 1;
}
run().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
