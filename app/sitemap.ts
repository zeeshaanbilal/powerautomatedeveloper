import type { MetadataRoute } from "next";
import { getPublished, publicPath } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await getPublished())
    .filter(
      (e) =>
        !e.seo.noindex &&
        !["FAQ", "TESTIMONIAL"].includes(e.kind) &&
        (!e.seo.canonical ||
          e.seo.canonical ===
            "https://powerautomatedeveloper.com" + publicPath(e.slug)),
    )
    .map((e) => ({
      url: "https://powerautomatedeveloper.com" + publicPath(e.slug),
      lastModified: new Date(e.updatedAt),
    }));
}
