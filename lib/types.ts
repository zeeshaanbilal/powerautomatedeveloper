export const kinds = [
  "PAGE",
  "SERVICE",
  "HIRE",
  "INDUSTRY",
  "DEVELOPER",
  "TEAM",
  "CASE_STUDY",
  "BLOG",
  "GUIDE",
  "FAQ",
  "TESTIMONIAL",
] as const;
export type Kind = (typeof kinds)[number];
export const adminKinds = kinds.filter((kind) => kind !== "DEVELOPER");
export type SEO = {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaEnabled?: boolean;
};
export type Section = { title: string; text: string; items?: string[] };
export type ContentData = {
  sampleContent?: boolean;
  homeCopy?: Record<string, string>;
  eyebrow?: string;
  sections?: Section[];
  faqs?: { question: string; answer: string }[];
  related?: string[];
  skills?: string[];
  role?: string;
  socials?: { label: string; url: string }[];
  client?: string;
  industry?: string;
  problem?: string;
  solution?: string;
  implementation?: string;
  results?: string;
  technologies?: string[];
  gallery?: { url: string; alt: string }[];
  categoryNames?: string[];
  tagNames?: string[];
  authorName?: string;
  resourceGroup?: string;
  primaryCta?: string;
  secondaryCta?: string;
  verified?: boolean;
};
export type Entry = {
  id: string;
  kind: Kind;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: string;
  publishedAt: string | Date | null;
  sortOrder: number;
  featuredImage: string;
  imageAlt: string;
  seo: SEO;
  data: ContentData;
  updatedAt: string | Date;
};
export type Settings = {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  favicon: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage: string;
  consultationLabel: string;
  consultationUrl: string;
  socialLinks: { label: string; url: string }[];
  googleAnalyticsId: string;
  searchConsoleToken: string;
  trackingNotes: string;
};
