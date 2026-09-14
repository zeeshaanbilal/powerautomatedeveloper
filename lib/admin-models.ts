import { z } from "zod";
import { slugField, urlField } from "./validation";
export const managerModels = {
  categories: {
    label: "Categories",
    fields: { name: "text", slug: "text" },
    schema: z.object({
      name: z.string().min(1).max(100),
      slug: slugField.refine((v) => !!v && !v.includes("/")),
    }),
  },
  tags: {
    label: "Tags",
    fields: { name: "text", slug: "text" },
    schema: z.object({
      name: z.string().min(1).max(100),
      slug: slugField.refine((v) => !!v && !v.includes("/")),
    }),
  },
  navigation: {
    label: "Navigation",
    fields: {
      label: "text",
      href: "text",
      location: "HEADER,FOOTER",
      sortOrder: "number",
      active: "checkbox",
    },
    schema: z.object({
      label: z.string().min(1).max(60),
      href: z.string().regex(/^\/(?!\/)[a-z0-9\/-]*$/),
      location: z.enum(["HEADER", "FOOTER"]),
      sortOrder: z.coerce.number().int().min(-10000).max(10000),
      active: z.boolean(),
    }),
  },
  redirects: {
    label: "Redirects",
    fields: {
      source: "text",
      destination: "text",
      statusCode: "301,308",
      active: "checkbox",
    },
    schema: z.object({
      source: z
        .string()
        .regex(
          /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
          "Use a clean local path with a trailing slash",
        ),
      destination: z
        .string()
        .regex(
          /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
          "Use a clean local destination with a trailing slash",
        ),
      statusCode: z.coerce.number().refine((v) => v === 301 || v === 308),
      active: z.boolean(),
    }),
  },
  growth: {
    label: "SEO / Growth",
    fields: {
      website: "text",
      url: "url",
      contact: "text",
      domain: "text",
      opportunityType:
        "Guide,Tutorial,Case study,Research,Partnership,Directory,Community,Guest contribution",
      status: "RESEARCH,CONTACTED,RESPONDED,LINK_OBTAINED,CLOSED",
      dateContacted: "date",
      response: "textarea",
      linkObtained: "url",
      anchorText: "text",
      notes: "textarea",
    },
    schema: z.object({
      website: z.string().min(1).max(200),
      url: urlField,
      contact: z.string().max(300),
      domain: z.string().min(1).max(200),
      opportunityType: z.string().max(100),
      status: z.enum([
        "RESEARCH",
        "CONTACTED",
        "RESPONDED",
        "LINK_OBTAINED",
        "CLOSED",
      ]),
      dateContacted: z
        .string()
        .nullable()
        .transform((v) => (v ? new Date(v) : null))
        .refine((v) => !v || !Number.isNaN(v.getTime()), "Invalid date"),
      response: z.string().max(10000),
      linkObtained: urlField,
      anchorText: z.string().max(300),
      notes: z.string().max(10000),
    }),
  },
};
export type Manager = keyof typeof managerModels;
export const modelNames = {
  categories: "category",
  tags: "tag",
  navigation: "navigationItem",
  redirects: "redirect",
  growth: "growthOpportunity",
} as const;
