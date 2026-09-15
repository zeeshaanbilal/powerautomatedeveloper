import Link from "./safe-link";
import Image from "next/image";
import { DeveloperCard } from "./developer-card";
import type { Entry } from "@/lib/types";
import { publicPath, getSettings } from "@/lib/content";
import { ServiceIcon } from "./service-icon";
export function JsonLd({ value }: { value: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function Breadcrumbs({
  entry,
  entries,
}: {
  entry: Entry;
  entries: Entry[];
}) {
  const bits = entry.slug.split("/");
  const crumbs = [{ title: "Home", href: "/" }];
  bits.forEach((_, i) => {
    const slug = bits.slice(0, i + 1).join("/");
    const found = entries.find((e) => e.slug === slug);
    if (found) crumbs.push({ title: found.title, href: publicPath(slug) });
  });
  const backCrumb = crumbs.length > 2 ? crumbs[crumbs.length - 2] : null;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {backCrumb && (
          <Link 
            href={backCrumb.href} 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              fontSize: "14px", 
              fontWeight: 500, 
              color: "var(--accent)", 
              textDecoration: "none"
            }}
          >
            ← Back to {backCrumb.title}
          </Link>
        )}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {crumbs.map((c, i) => (
            <li key={c.href}>
              {i === crumbs.length - 1 ? (
                <span aria-current="page">{c.title}</span>
              ) : (
                <Link href={c.href}>{c.title}</Link>
              )}
            </li>
          ))}
        </ol>
        </nav>
      </div>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.title,
            item: "https://powerautomatedeveloper.com" + c.href,
          })),
        }}
      />
    </>
  );
}
export function Cards({ entries }: { entries: Entry[] }) {
  return (
    <div className="card-grid">
      {entries.map((e, i) =>
        ["DEVELOPER", "TEAM"].includes(e.kind) ? (
          <DeveloperCard key={e.id} entry={e} />
        ) : (
          <Link
            className={`service-card${e.featuredImage ? " image-card" : ""}`}
            href={publicPath(e.slug)}
            key={e.id}
          >
            {e.featuredImage ? (
              <div className="card-image">
                <Image
                  src={e.featuredImage}
                  alt={e.imageAlt}
                  width={720}
                  height={480}
                  sizes="(max-width: 767px) 100vw, (max-width: 1190px) 50vw, 33vw"
                  unoptimized={!e.featuredImage.startsWith("/")}
                />
              </div>
            ) : (
              <span className="card-icon" aria-hidden="true">
                <ServiceIcon slug={e.slug} />
              </span>
            )}
            {e.kind === "BLOG" && (
              <span className="article-meta">
                {e.data.sampleContent
                  ? "Sample article"
                  : e.data.categoryNames?.[0] || "Insights"}
              </span>
            )}
            <h3>{e.title}</h3>
            <p>{e.excerpt}</p>
            <span className="card-link">
              {e.kind === "BLOG"
                ? "Read article"
                : `Explore ${e.kind === "SERVICE" ? "service" : "more"}`}{" "}
              <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ),
      )}
    </div>
  );
}
export function FAQs({ items }: { items: NonNullable<Entry["data"]["faqs"]> }) {
  return (
    <div className="faq-list">
      {items.map((f) => (
        <details key={f.question}>
          <summary>
            {f.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
export async function CTA({
  label = "Let’s build a better way to work.",
  button,
}: {
  label?: string;
  button?: string;
}) {
  const settings = await getSettings();
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">Your next step</span>
          <h2>{label}</h2>
          <p>Start with the process. We’ll help you find the right approach.</p>
        </div>
        <Link
          href={button ? "/contact/" : settings.consultationUrl}
          className="button button-light"
          data-conversion="consultation_request"
        >
          {button || settings.consultationLabel}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
