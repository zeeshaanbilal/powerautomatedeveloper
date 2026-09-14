import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db, hasDatabase } from "./db";
import { defaults, seedContent, defaultNavigation } from "./seed-content";
import type { Entry, Settings } from "./types";
export const isPublished = (
  entry: Pick<Entry, "status" | "publishedAt">,
  now = new Date(),
) =>
  entry.status === "PUBLISHED" &&
  (!entry.publishedAt || new Date(entry.publishedAt) <= now);
const loadContent = unstable_cache(
  async () =>
    db.content.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        categories: true,
        tags: true,
        related: { select: { slug: true } },
        author: { select: { name: true } },
      },
    }),
  ["cms-content"],
  { tags: ["cms"], revalidate: 300 },
);
const loadSettings = unstable_cache(
  () => db.siteSettings.findUnique({ where: { id: "site" } }),
  ["cms-settings"],
  { tags: ["cms"], revalidate: 300 },
);
const loadNavigation = unstable_cache(
  (location: string) =>
    db.navigationItem.findMany({
      where: { active: true, location },
      orderBy: { sortOrder: "asc" },
    }),
  ["cms-navigation"],
  { tags: ["cms"], revalidate: 300 },
);
export const getAllContent = cache(async (): Promise<Entry[]> => {
  if (!hasDatabase()) return seedContent;
  const rows = await loadContent();
  return rows.map((row) => ({
    ...row,
    data: {
      ...(row.data as object),
      categoryNames: row.categories.map((c) => c.name),
      tagNames: row.tags.map((t) => t.name),
      related: row.related.length
        ? row.related.map((r) => r.slug)
        : (row.data as { related?: string[] }).related,
      authorName:
        row.author?.name || (row.data as { authorName?: string }).authorName,
    },
  })) as unknown as Entry[];
});
export const getPublished = cache(async () => {
  const entries = (await getAllContent()).filter((e) => isPublished(e));
  return entries.map((entry) => {
    const collectionKinds: Record<string, string[]> = {
      "case-studies": ["CASE_STUDY"],
      blog: ["BLOG"],
      resources: ["BLOG", "GUIDE"],
      "resources/guides": ["GUIDE"],
      "resources/power-automate-guides": ["GUIDE"],
      "resources/automation-guides": ["GUIDE"],
    };
    const types = collectionKinds[entry.slug];
    const hasArticles =
      !types ||
      entries.some(
        (child) =>
          types.includes(child.kind) &&
          !child.data.sampleContent &&
          (entry.slug !== "resources/power-automate-guides" ||
            child.data.resourceGroup === "power-automate") &&
          (entry.slug !== "resources/automation-guides" ||
            child.data.resourceGroup === "automation"),
      );
    const relatedFaqs = entries.filter(
      (child) =>
        child.kind === "FAQ" && entry.data.related?.includes(child.slug),
    );
    return {
      ...entry,
      seo: {
        ...entry.seo,
        noindex:
          entry.seo.noindex || !!entry.data.sampleContent || !hasArticles,
      },
      data: {
        ...entry.data,
        faqs: [
          ...(entry.data.faqs || []),
          ...relatedFaqs.map((faq) => ({
            question: faq.title,
            answer: faq.excerpt,
          })),
        ],
      },
    };
  });
});
export const getEntry = cache(async (slug: string) =>
  (await getPublished()).find((e) => e.slug === slug),
);
export const getSettings = cache(async (): Promise<Settings> => {
  if (!hasDatabase()) return defaults;
  const row = await loadSettings();
  return { ...defaults, ...((row?.value as object) || {}) };
});
export const getNavigation = cache(async (location = "HEADER") => {
  if (!hasDatabase())
    return defaultNavigation.filter((n) => n.location === location);
  return loadNavigation(location);
});
export function publicPath(slug: string) {
  return slug ? `/${slug}/` : "/";
}
