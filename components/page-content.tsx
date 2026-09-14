import Image from "next/image";
import Link from "./safe-link";
import { Entry } from "@/lib/types";
import { cleanHtml } from "@/lib/validation";
import { Breadcrumbs, Cards, CTA, FAQs } from "./content-blocks";
import { ContactForm } from "./contact-form";
import { DeveloperSection } from "./developer-card";
const collections: Record<string, string[]> = {
  services: ["SERVICE"],
  hire: ["HIRE"],
  industries: ["INDUSTRY"],
  developers: ["DEVELOPER", "TEAM"],
  "developers/our-team": ["DEVELOPER", "TEAM"],
  "case-studies": ["CASE_STUDY"],
  blog: ["BLOG"],
  "resources/guides": ["GUIDE"],
  "resources/power-automate-guides": ["GUIDE"],
  "resources/automation-guides": ["GUIDE"],
};
export function PageContent({
  entry,
  entries,
  preview = false,
}: {
  entry: Entry;
  entries: Entry[];
  preview?: boolean;
}) {
  const isPerson = ["DEVELOPER", "TEAM"].includes(entry.kind);
  const isLegal = ["privacy-policy", "terms", "cookie-policy"].includes(
    entry.slug,
  );
  let collection = collections[entry.slug]
    ? entries.filter((e) => collections[entry.slug].includes(e.kind))
    : [];
  if (entry.slug === "resources/power-automate-guides")
    collection = collection.filter(
      (e) => e.data.resourceGroup === "power-automate",
    );
  if (entry.slug === "resources/automation-guides")
    collection = collection.filter(
      (e) => e.data.resourceGroup === "automation",
    );
  if (entry.slug === "resources")
    collection = entries.filter((e) =>
      [
        "blog",
        "resources/guides",
        "resources/power-automate-guides",
        "resources/automation-guides",
      ].includes(e.slug),
    );
  const related = entries.filter(
    (e) =>
      entry.data.related?.includes(e.slug) &&
      !["FAQ", "TESTIMONIAL"].includes(e.kind),
  );
  return (
    <>
      {entry.data.sampleContent && (
        <div className="sample-banner">
          Sample article · Illustrative content for this website preview.
        </div>
      )}
      {preview && (
        <div className="preview-banner">
          Authenticated draft preview · not publicly indexed
        </div>
      )}
      <div className="container">
        <Breadcrumbs entry={entry} entries={entries} />
      </div>
      <section className="page-hero">
        <div className={isPerson ? "container team-profile-hero" : "container"}>
          <div>
            <span className="eyebrow">
              {entry.data.eyebrow ||
                entry.data.role ||
                "HashTurn / Business automation"}
            </span>
            <h1>{entry.title}</h1>
            <p>{entry.excerpt}</p>
            {entry.data.categoryNames?.length || entry.data.tagNames?.length ? (
              <div className="chips">
                {[
                  ...(entry.data.categoryNames || []),
                  ...(entry.data.tagNames || []),
                ].map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            ) : null}
            {entry.kind === "CASE_STUDY" &&
            (entry.data.client || entry.data.industry) ? (
              <p className="small">
                {[entry.data.client, entry.data.industry]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            {(["SERVICE", "HIRE", "INDUSTRY"].includes(entry.kind) ||
              isPerson) && (
              <Link
                href="/contact/"
                className="button"
                data-conversion="consultation_request"
              >
                {entry.data.primaryCta || "Discuss your project"} ↗
              </Link>
            )}
            {entry.data.authorName && (
              <p className="small">
                By {entry.data.authorName}
                {entry.publishedAt &&
                  ` · ${new Date(entry.publishedAt).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}`}
              </p>
            )}
            {isPerson && (
              <p className="team-profile-back">
                <Link href="/developers/our-team/" className="text-link">
                  Meet the rest of HASHTURN
                </Link>
              </p>
            )}
          </div>
          {isPerson && entry.featuredImage && (
            <Image
              className="team-profile-photo"
              src={entry.featuredImage}
              alt={entry.imageAlt || entry.title}
              width={650}
              height={650}
              sizes="(max-width: 767px) 90vw, 420px"
              priority
              unoptimized={!entry.featuredImage.startsWith("/")}
            />
          )}
        </div>
      </section>
      {(entry.kind === "HIRE" || entry.slug === "hire") && (
        <DeveloperSection entries={entries} />
      )}
      {entry.slug === "contact" ? (
        <section className="container section contact-layout">
          <div>
            <span className="eyebrow">Tell us what you have in mind</span>
            <h2>A useful conversation starts with your process.</h2>
            <p>
              Share the systems you use, the tasks you repeat and the outcome
              you need.
            </p>
            <ol className="contact-steps">
              <li>Share your project</li>
              <li>Discuss the requirements</li>
              <li>Agree a practical next step</li>
            </ol>
          </div>
          <ContactForm />
        </section>
      ) : (
        <>
          {entry.featuredImage && !isPerson && (
            <div className="container feature-image">
              <Image
                src={entry.featuredImage}
                alt={entry.imageAlt}
                width={1200}
                height={650}
                sizes="(max-width: 768px) 100vw, 1100px"
                unoptimized={!entry.featuredImage.startsWith("/")}
              />
            </div>
          )}
          {collection.length > 0 && (
            <section className="container section">
              <h2 className="sr-only">Explore {entry.title}</h2>
              <Cards entries={collection} />
            </section>
          )}
          {entry.data.sections?.length ||
          entry.body ||
          entry.kind === "CASE_STUDY" ? (
            <div className="container article-layout">
              <article className="prose">
                {entry.data.sections?.map((s, i) => (
                  <section key={i}>
                    <h2>{s.title}</h2>
                    <p>{s.text}</p>
                    {s.items && (
                      <ul>
                        {s.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
                {entry.body && (
                  <div
                    dangerouslySetInnerHTML={{ __html: cleanHtml(entry.body) }}
                  />
                )}
                {entry.kind === "CASE_STUDY" &&
                  (
                    [
                      "problem",
                      "solution",
                      "implementation",
                      "results",
                    ] as const
                  )
                    .filter((k) => entry.data[k])
                    .map((k) => (
                      <section key={k}>
                        <h2 className="capitalize">{k}</h2>
                        <p>{entry.data[k]}</p>
                      </section>
                    ))}
                {entry.data.gallery?.map((i) => (
                  <figure key={i.url}>
                    <Image
                      src={i.url}
                      alt={i.alt}
                      width={1000}
                      height={650}
                      sizes="(max-width: 768px) 100vw, 750px"
                      unoptimized={!i.url.startsWith("/")}
                    />
                    <figcaption>{i.alt}</figcaption>
                  </figure>
                ))}
              </article>
              <aside className="article-aside">
                {isLegal ? (
                  <>
                    <span className="eyebrow">HashTurn LLC</span>
                    <h2>Website policies</h2>
                    <nav aria-label="Website policies">
                      <p>
                        <Link href="/privacy-policy/">Privacy Policy</Link>
                      </p>
                      <p>
                        <Link href="/terms/">Terms of Use</Link>
                      </p>
                      <p>
                        <Link href="/cookie-policy/">Cookie Policy</Link>
                      </p>
                    </nav>
                    <p>Questions about these policies or your information?</p>
                    <Link className="text-link" href="/contact/">
                      Contact HashTurn ↗
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="eyebrow">
                      Let’s talk about your process
                    </span>
                    <h2>Make your next step a useful one.</h2>
                    <p>
                      Bring your questions, existing workflows or a new idea.
                    </p>
                    <Link href="/contact/" className="button">
                      Talk to HashTurn ↗
                    </Link>
                  </>
                )}
              </aside>
            </div>
          ) : null}
          {entry.data.skills?.length || entry.data.technologies?.length ? (
            <section className="container section">
              <span className="eyebrow">Tools & capabilities</span>
              <h2>Connected expertise</h2>
              <div className="chips">
                {[
                  ...(entry.data.skills || []),
                  ...(entry.data.technologies || []),
                ].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </section>
          ) : null}
          {entry.data.socials?.length ? (
            <div className="container button-row">
              {entry.data.socials.map((s) => (
                <a href={s.url} key={s.url} className="text-link">
                  {s.label} ↗
                </a>
              ))}
            </div>
          ) : null}
          {collections[entry.slug] &&
            !collection.length &&
            !entry.data.sections?.length && (
              <section className="container section">
                <div className="empty-state">
                  <h2>Reviewed content, published with care.</h2>
                  <p>
                    This collection has no published entries yet. In the
                    meantime, explore our services or ask us about your
                    requirements.
                  </p>
                  <Link href="/services/" className="text-link">
                    Explore services ↗
                  </Link>
                </div>
              </section>
            )}
          {entry.data.faqs?.length ? (
            <section className="soft-section section">
              <div className="container faq-grid">
                <h2>Your questions, answered.</h2>
                <FAQs items={entry.data.faqs} />
              </div>
            </section>
          ) : null}
          {related.length > 0 && (
            <section className="container section">
              <span className="eyebrow">Keep exploring</span>
              <h2>Related expertise</h2>
              <Cards entries={related} />
            </section>
          )}
        </>
      )}
      {!["privacy-policy", "terms", "cookie-policy"].includes(entry.slug) && (
        <CTA button={entry.data.primaryCta} />
      )}
    </>
  );
}
