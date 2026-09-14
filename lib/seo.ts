import type { Metadata } from "next";
import type { Entry, Settings } from "./types";
import { siteOrigin, cleanHtml } from "./validation";
import { publicPath } from "./content";
export function metadata(entry: Entry, settings: Settings): Metadata {
  const canonical = entry.seo.canonical || siteOrigin + publicPath(entry.slug);
  const title = entry.seo.title || `${entry.title} | ${settings.companyName}`;
  const description = entry.seo.description || entry.excerpt;
  const img =
    entry.seo.ogImage || settings.defaultOgImage || "/opengraph-image";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: entry.seo.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: entry.seo.ogTitle || title,
      description: entry.seo.ogDescription || description,
      url: canonical,
      type: entry.kind === "BLOG" ? "article" : "website",
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.seo.twitterTitle || title,
      description: entry.seo.twitterDescription || description,
      images: [entry.seo.twitterImage || img],
    },
  };
}
export function schemaFor(entry: Entry, settings: Settings) {
  if (entry.seo.schemaEnabled === false) return [];
  const url = siteOrigin + publicPath(entry.slug);
  const org = {
    "@type": "Organization",
    "@id": siteOrigin + "/#organization",
    name: settings.companyName,
    url: siteOrigin,
    ...(settings.logo ? { logo: new URL(settings.logo, siteOrigin).href } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    sameAs: settings.socialLinks.map((s) => s.url),
  };
  const base = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url + "#webpage",
    url,
    name: entry.title,
    description: entry.excerpt,
    isPartOf: { "@id": siteOrigin + "/#website" },
  };
  const result: object[] = [base];
  if (!entry.slug)
    result.push(
      { "@context": "https://schema.org", ...org },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": siteOrigin + "/#website",
        url: siteOrigin,
        name: settings.companyName,
        publisher: { "@id": siteOrigin + "/#organization" },
      },
    );
  if (["SERVICE", "HIRE"].includes(entry.kind))
    result.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: entry.title,
      description: entry.excerpt,
      url,
      provider: org,
    });
  if (["DEVELOPER", "TEAM"].includes(entry.kind))
    result.push({
      "@context": "https://schema.org",
      "@type": "Person",
      name: entry.title,
      jobTitle: entry.data.role,
      knowsAbout: entry.data.skills,
      worksFor: org,
      url,
    });
  if (["BLOG", "GUIDE", "CASE_STUDY"].includes(entry.kind))
    result.push({
      "@context": "https://schema.org",
      "@type": entry.kind === "BLOG" ? "BlogPosting" : "Article",
      headline: entry.title,
      description: entry.excerpt,
      datePublished: entry.publishedAt,
      dateModified: entry.updatedAt,
      mainEntityOfPage: url,
      author: entry.data.authorName
        ? { "@type": "Person", name: entry.data.authorName }
        : org,
      publisher: org,
      image: new URL(
        entry.featuredImage || entry.seo.ogImage || settings.defaultOgImage,
        siteOrigin,
      ).href,
    });
  if (entry.data.faqs?.length)
    result.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: entry.data.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  return result;
}
export function auditEntries(entries: Entry[]) {
  const publicEntries = entries.filter(
    (e) => !["FAQ", "TESTIMONIAL"].includes(e.kind),
  );
  const paths = new Set(publicEntries.map((e) => publicPath(e.slug)));
  const duplicate = (field: "title" | "description", entry: Entry) =>
    publicEntries.some(
      (e) =>
        e.id !== entry.id &&
        e.seo[field] === entry.seo[field] &&
        Boolean(entry.seo[field]),
    );
  return publicEntries.map((e) => {
    const html = cleanHtml(e.body);
    const bodyLinks = [...html.matchAll(/href="(\/[^"]*)"/g)].map(
      (m) => m[1].split(/[?#]/)[0],
    );
    const links = [
      ...(e.data.related || [])
        .filter(
          (slug) =>
            !entries.some(
              (record) =>
                record.slug === slug &&
                ["FAQ", "TESTIMONIAL"].includes(record.kind),
            ),
        )
        .map(publicPath),
      ...bodyLinks,
    ];
    const text = [
      e.excerpt,
      html.replace(/<[^>]*>/g, " "),
      ...(e.data.sections || []).map((s) => s.text),
      e.data.problem,
      e.data.solution,
      e.data.results,
    ].join(" ");
    const warnings = [
      !e.seo.title && "Missing title",
      !e.seo.description && "Missing meta description",
      !e.seo.canonical && "Missing canonical",
      !e.title && "Missing H1",
      !e.seo.ogImage && "Missing page OG image (site fallback used)",
      e.featuredImage && !e.imageAlt && "Missing image alt text",
      e.data.gallery?.some((i) => !i.alt) && "Missing gallery alt text",
      /<img\b(?![^>]*\balt="[^"]+")/i.test(html) &&
        "Missing body image alt text",
      duplicate("title", e) && "Duplicate title",
      duplicate("description", e) && "Duplicate description",
      e.seo.schemaEnabled === false && "Missing schema",
      e.seo.noindex && "Noindex",
      text.split(/\s+/).length < 120 && "Short content: review usefulness",
      ...links
        .filter((l) => !paths.has(l.endsWith("/") ? l : l + "/"))
        .map((l) => `Broken link: ${l}`),
    ].filter(Boolean) as string[];
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      noindex: Boolean(e.seo.noindex),
      warnings,
    };
  });
}
