import { PrismaClient } from "@prisma/client";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { pageCopyDrafts } from "../lib/page-copy-drafts";
const db = new PrismaClient();
const origin = "http://localhost:3000";
async function main() {
  const rows = await db.content.findMany({
    where: { slug: { in: Object.keys(pageCopyDrafts) } },
    include: {
      categories: true,
      tags: true,
      related: { select: { slug: true } },
    },
  });
  if (rows.length !== Object.keys(pageCopyDrafts).length)
    throw Error("One or more target pages are missing; no content changed.");
  await mkdir("artifacts/content-backups", { recursive: true });
  const backup = `artifacts/content-backups/pages-${Date.now()}.json`;
  await writeFile(backup, JSON.stringify(rows, null, 2), { flag: "wx" });
  console.log(`Saved pre-edit page backup: ${backup}`);
  const credentials = await readFile(".admin-credentials.txt", "utf8");
  const email = credentials.match(/^Email: (.+)$/m)?.[1]?.trim();
  const password = credentials.match(/^Password: (.+)$/m)?.[1]?.trim();
  let cookie = "";
  const call = async (path: string, data?: unknown, method = "POST") => {
    const response = await fetch(origin + path, {
      method,
      headers: {
        Origin: origin,
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
    if (!response.ok) throw Error(`${path}: ${response.status}`);
    return response;
  };
  const login = await call("/api/admin/auth/", { email, password });
  cookie = login.headers.get("set-cookie")?.split(";")[0] || "";
  try {
    for (const row of rows) {
      const copy = pageCopyDrafts[row.slug];
      await call("/api/admin/content/", {
        ...row,
        excerpt: copy.excerpt,
        publishedAt: row.publishedAt?.toISOString() || null,
        seo: { ...(row.seo as object), description: copy.excerpt },
        data: {
          ...(row.data as object),
          sections: copy.sections,
          categoryNames: row.categories.map((c) => c.name),
          tagNames: row.tags.map((t) => t.name),
          related: row.related.length
            ? row.related.map((r) => r.slug)
            : (row.data as { related?: string[] }).related || [],
        },
      });
      console.log(`Updated /${row.slug}/ (${copy.sections.length} sections)`);
    }
  } finally {
    await call("/api/admin/auth/", undefined, "DELETE");
  }
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
