import { z } from "zod";
import sanitize from "sanitize-html";
import { kinds } from "./types";
export const siteOrigin = "https://powerautomatedeveloper.com";
export function cleanHtml(html: string) {
  return sanitize(html, {
    allowedTags: [
      "p",
      "br",
      "h2",
      "h3",
      "h4",
      "strong",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      img: (_tag, attrs) => ({
        tagName: "img",
        attribs: { ...attrs, loading: "lazy" },
      }),
    },
  });
}
export function safeUrl(value: string) {
  return (
    value === "" ||
    /^\/(?!\/)[^\s\\]*$/.test(value) ||
    /^https:\/\/[^\s]+$/.test(value)
  );
}
export const urlField = z
  .string()
  .max(2048)
  .refine(safeUrl, "Use a local path or HTTPS URL");
export const slugField = z
  .string()
  .max(180)
  .regex(
    /^(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/,
    "Use lowercase words and hyphens",
  );
export const seoSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(500),
  canonical: z
    .string()
    .max(2048)
    .refine(
      (v) =>
        !v ||
        (v.startsWith(siteOrigin + "/") &&
          !/[?#]/.test(v) &&
          new URL(v).origin === siteOrigin),
      "Canonical must use the preferred HTTPS domain without query parameters",
    ),
  noindex: z.boolean().optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(500).optional(),
  ogImage: urlField.optional(),
  twitterTitle: z.string().max(200).optional(),
  twitterDescription: z.string().max(500).optional(),
  twitterImage: urlField.optional(),
  schemaEnabled: z.boolean().optional(),
});
const section = z.object({
  title: z.string().max(200),
  text: z.string().max(10000),
  items: z.array(z.string().max(1000)).max(40).optional(),
});
export const dataSchema = z.object({
  sampleContent: z.boolean().optional(),
  homeCopy: z.record(z.string(), z.string().max(5000)).optional(),
  eyebrow: z.string().max(150).optional(),
  sections: z.array(section).max(40).optional(),
  faqs: z
    .array(
      z.object({ question: z.string().max(300), answer: z.string().max(5000) }),
    )
    .max(40)
    .optional(),
  related: z.array(slugField).max(40).optional(),
  skills: z.array(z.string().max(100)).max(50).optional(),
  role: z.string().max(200).optional(),
  socials: z
    .array(z.object({ label: z.string().max(60), url: urlField }))
    .optional(),
  client: z.string().max(200).optional(),
  industry: z.string().max(200).optional(),
  problem: z.string().max(15000).optional(),
  solution: z.string().max(15000).optional(),
  implementation: z.string().max(15000).optional(),
  results: z.string().max(15000).optional(),
  technologies: z.array(z.string().max(100)).optional(),
  gallery: z
    .array(z.object({ url: urlField, alt: z.string().max(500) }))
    .max(30)
    .optional(),
  categoryNames: z.array(z.string().max(100)).optional(),
  tagNames: z.array(z.string().max(100)).optional(),
  authorName: z.string().max(120).optional(),
  resourceGroup: z.enum(["general", "power-automate", "automation"]).optional(),
  primaryCta: z.string().max(120).optional(),
  secondaryCta: z.string().max(120).optional(),
  verified: z.boolean().optional(),
});
export const contentSchema = z
  .object({
    id: z.string().optional(),
    kind: z.enum(kinds),
    slug: slugField,
    title: z.string().min(1).max(200),
    excerpt: z.string().max(1500),
    body: z.string().max(200000).transform(cleanHtml),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    publishedAt: z.string().nullable(),
    sortOrder: z.coerce.number().int().min(-10000).max(10000),
    featuredImage: urlField,
    imageAlt: z.string().max(500),
    seo: seoSchema,
    data: dataSchema,
  })
  .superRefine((v, ctx) => {
    if (/^(admin|api|login|sitemap\.xml|robots\.txt)(\/|$)/.test(v.slug))
      ctx.addIssue({
        code: "custom",
        message: "This path is reserved",
        path: ["slug"],
      });
    if (v.publishedAt && Number.isNaN(Date.parse(v.publishedAt)))
      ctx.addIssue({
        code: "custom",
        message: "Invalid publication date",
        path: ["publishedAt"],
      });
    if (
      v.status === "PUBLISHED" &&
      ["CASE_STUDY", "TESTIMONIAL"].includes(v.kind) &&
      !v.data.verified
    )
      ctx.addIssue({
        code: "custom",
        message: "Verify factual claims and permission to publish first",
        path: ["data", "verified"],
      });
    const prefixes: Record<string, string> = {
      SERVICE: "services/",
      HIRE: "hire/",
      INDUSTRY: "industries/",
      DEVELOPER: "developers/",
      TEAM: "developers/",
      CASE_STUDY: "case-studies/",
      BLOG: "blog/",
      GUIDE: "resources/guides/",
    };
    if (prefixes[v.kind] && !v.slug.startsWith(prefixes[v.kind]))
      ctx.addIssue({
        code: "custom",
        message: `This content type needs the path prefix ${prefixes[v.kind]}`,
        path: ["slug"],
      });
  });
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(150),
  email: z.email().max(254),
  phone: z.string().max(40).default(""),
  projectType: z.string().min(1).max(100),
  services: z.array(z.string().max(100)).max(20),
  description: z.string().trim().min(20).max(10000),
  budget: z.string().max(100).default(""),
  timeline: z.string().max(100).default(""),
  website: z.string().max(200).default(""),
  challenge: z.string().max(300),
});
