import type { SEO } from "./types";
const origin = "https://powerautomatedeveloper.com";
const url = (slug: string) => `${origin}/${slug ? `${slug}/` : ""}`;
export function canonicalAfterRename(
  seo: SEO,
  oldSlug: string | undefined,
  newSlug: string,
): SEO {
  return oldSlug !== undefined &&
    oldSlug !== newSlug &&
    seo.canonical === url(oldSlug)
    ? { ...seo, canonical: url(newSlug) }
    : seo;
}
