import Link from "./safe-link";
import type { Entry } from "@/lib/types";
import { Cards, CTA, FAQs } from "./content-blocks";
import Image from "next/image";
import { AutomationVisual } from "./automation-visual";
import { homeCopy } from "@/lib/home-copy";
import { getSettings } from "@/lib/content";
export async function Home({
  entry,
  entries,
}: {
  entry: Entry;
  entries: Entry[];
}) {
  const settings = await getSettings();
  const copy = (key: keyof typeof homeCopy) =>
    entry.data.homeCopy?.[key] || homeCopy[key];
  const services = entries.filter((e) => e.kind === "SERVICE");
  const cases = entries.filter((e) => e.kind === "CASE_STUDY").slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-square" />
              {entry.data.eyebrow}
            </div>
            <h1>{entry.title}</h1>
            <p className="hero-lead">{entry.excerpt}</p>
            <p className="hero-detail">{copy("text01")}</p>
            <div className="button-row">
              <Link
                href="/hire/power-automate-developer/"
                className="button"
                data-conversion="hire_developer_cta"
              >
                {entry.data.primaryCta || "Hire a Power Automate Developer"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                href={settings.consultationUrl}
                className="text-link"
                data-conversion="consultation_request"
              >
                {entry.data.secondaryCta || "Book a Free Consultation"}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-proof">
              <span className="mini-avatars" aria-hidden="true">
                <i>PA</i>
                <i>{copy("text02")}</i>
                <i>AI</i>
              </span>
              <span>
                <strong>{copy("text03")}</strong>
                <br />
                {copy("text04")}
              </span>
            </div>
          </div>
          <AutomationVisual
            src={entry.featuredImage || "/images/automation-documents.webp"}
            alt={
              entry.imageAlt ||
              "Blue ribbons connecting glass document panels, an illustration of workflow automation"
            }
          />
        </div>
      </section>
      <section className="tech-strip">
        <div className="container">
          <span>
            {copy("text05")}
            <br />
            {copy("text06")}
          </span>
          <div>
            <b>
              <Image
                className="tech-logo"
                src="/images/microsoft-365-2022.svg"
                alt=""
                width={32}
                height={35}
              />
              {copy("text07")}
            </b>
            <b>
              <Image
                className="tech-logo"
                src="/images/power-automate.svg"
                alt=""
                width={32}
                height={32}
              />
              {copy("text08").replace(/^↗\s*/, "")}
            </b>
            <b>
              <Image
                className="tech-logo"
                src="/images/power-apps.png"
                alt=""
                width={32}
                height={32}
              />
              {copy("text09").replace(/^◇\s*/, "")}
            </b>
            <b>
              <Image
                className="tech-logo"
                src="/images/sharepoint.svg"
                alt=""
                width={32}
                height={35}
              />
              {copy("text10").replace(/^▤\s*/, "")}
            </b>
            <b>
              <Image
                className="tech-logo"
                src="/images/dataverse.png"
                alt=""
                width={32}
                height={32}
              />
              {copy("text11").replace(/^⊞\s*/, "")}
            </b>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy("text12")}</span>
            <h2>
              {entry.data.sections?.[0]?.title ||
                "Less busywork. More business."}
            </h2>
          </div>
          <p>{entry.data.sections?.[0]?.text}</p>
        </div>
        <div className="build-grid">
          {[
            [
              "01",
              copy("text13"),
              copy("text14"),
              "services/business-process-automation",
            ],
            ["02", copy("text15"), copy("text16"), "services/api-integrations"],
            ["03", copy("text17"), copy("text18"), "services/ai-builder"],
          ].map(([n, title, text, slug], index) => (
            <Link key={n} href={`/${slug}/`} className="build-card">
              <Image
                className="build-image"
                src={
                  entry.data.gallery?.[index]?.url ||
                  [
                    "/images/automation-documents.webp",
                    "/images/connected-systems.webp",
                    "/images/automation-strategy.webp",
                  ][index]
                }
                alt={
                  entry.data.gallery?.[index]?.alt ||
                  [
                    "Glass documents linked by blue ribbons",
                    "Interlocking glass loops representing connected systems",
                    "Blue and glass blocks arranged in steps",
                  ][index]
                }
                width={720}
                height={480}
                sizes="(max-width: 767px) 100vw, 33vw"
                unoptimized={
                  !!entry.data.gallery?.[index]?.url &&
                  !entry.data.gallery[index].url.startsWith("/")
                }
              />
              <span>
                {n} <i aria-hidden="true">↗</i>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy("text19")}</span>
              <h2>
                {copy("text20")}
                <br />
                {copy("text21")}
              </h2>
            </div>
            <Link href="/services/" className="text-link">
              {copy("text22")}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Cards
            entries={services.filter((e) =>
              [
                "power-automate-development",
                "power-automate-desktop",
                "power-apps-development",
                "sharepoint-automation",
                "api-integrations",
                "ai-builder",
              ].some((s) => e.slug.endsWith("/" + s)),
            )}
          />
        </div>
      </section>
      <section className="section container why-grid">
        <div>
          <span className="eyebrow">{copy("text23")}</span>
          <h2>
            {copy("text24")}
            <br />
            {copy("text25")}
            <br />
            {copy("text26")}
          </h2>
          <p className="muted">{copy("text27")}</p>
          <Link href="/about/" className="text-link">
            {copy("text28")}
          </Link>
        </div>
        <div className="why-list">
          {[
            [copy("text29"), copy("text30")],
            [copy("text31"), copy("text32")],
            [copy("text33"), copy("text34")],
          ].map(([t, p], i) => (
            <div key={t}>
              <span>0{i + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="engagement-section">
        <div className="container section">
          <span className="eyebrow">{copy("text35")}</span>
          <h2>
            {copy("text36")}
            <br />
            {copy("text37")}
          </h2>
          <div className="engagement-grid">
            <div>
              <span className="pill">{copy("text38")}</span>
              <h3>{copy("text39")}</h3>
              <p>{copy("text40")}</p>
              <Link
                href="/hire/power-automate-developer/"
                className="text-link"
                data-conversion="hire_developer_cta"
              >
                {copy("text41")}
              </Link>
            </div>
            <div>
              <span className="pill">{copy("text42")}</span>
              <h3>{copy("text43")}</h3>
              <p>{copy("text44")}</p>
              <Link
                href="/hire/power-automate-team/"
                className="text-link"
                data-conversion="hire_team_cta"
              >
                {copy("text45")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy("text46")}</span>
            <h2>
              {copy("text47")}
              <br />
              {copy("text48")}
            </h2>
          </div>
          <Link href="/industries/" className="text-link">
            {copy("text49")}
          </Link>
        </div>
        <div className="industry-list">
          {entries
            .filter((e) => e.kind === "INDUSTRY")
            .map((e) => (
              <Link key={e.id} href={`/${e.slug}/`}>
                {e.title.replace(" Workflow Automation", "")}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy("text50")}</span>
              <h2>
                {copy("text51")}
                <br />
                {copy("text52")}
              </h2>
            </div>
            <Link href="/case-studies/" className="text-link">
              {copy("text53")}
            </Link>
          </div>
          {cases.length ? (
            <Cards entries={cases} />
          ) : (
            <div className="case-placeholder">
              <span className="card-icon" aria-hidden="true">
                ▧
              </span>
              <div>
                <h3>{copy("text54")}</h3>
                <p>{copy("text55")}</p>
              </div>
              <Link href="/contact/" className="text-link">
                {copy("text56")}
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section container">
        <span className="eyebrow">{copy("text57")}</span>
        <h2>{copy("text58")}</h2>
        <div className="process-grid">
          {[
            ["Discover", copy("text59")],
            ["Design", copy("text60")],
            ["Build & test", copy("text61")],
            ["Launch & support", copy("text62")],
          ].map(([t, p], i) => (
            <div key={t}>
              <span>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container founder-section">
        {entries.find((e) => e.slug === "developers/zeeshan-bilal")
          ?.featuredImage ? (
          <Image
            className="founder-photo"
            src={
              entries.find((e) => e.slug === "developers/zeeshan-bilal")!
                .featuredImage
            }
            alt={
              entries.find((e) => e.slug === "developers/zeeshan-bilal")!
                .imageAlt || "Zeeshan Bilal, founder of HashTurn"
            }
            width={650}
            height={650}
            sizes="(max-width: 767px) 100vw, 45vw"
            unoptimized
          />
        ) : (
          <div className="founder-art" aria-hidden="true">
            <span className="eyebrow">{copy("text63")}</span>
            <div>
              Z<span>B</span>
              <i>↗</i>
            </div>
            <span>{copy("text64")}</span>
          </div>
        )}
        <div>
          <span className="eyebrow">{copy("text65")}</span>
          <h2>
            {copy("text66")}
            <br />
            {copy("text67")}
          </h2>
          <h3>{copy("text68")}</h3>
          <p className="founder-role">{copy("text69")}</p>
          <p>{copy("text70")}</p>
          <Link href="/developers/zeeshan-bilal/" className="text-link">
            {copy("text71")}
          </Link>
        </div>
      </section>
      <section className="section container stack">
        <span className="eyebrow">{copy("text72")}</span>
        <h2>{copy("text73")}</h2>
        <div className="chips">
          {[
            copy("text74"),
            copy("text75"),
            "SharePoint",
            "Dataverse",
            copy("text76"),
            copy("text77"),
            "Microsoft 365",
            copy("text78"),
            "n8n",
            "Python",
            "Excel / VBA",
            copy("text79"),
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">{copy("text80")}</span>
            <h2>
              {copy("text81")}
              <br />
              {copy("text82")}
            </h2>
            <Link href="/contact/" className="text-link">
              {copy("text83")}
            </Link>
          </div>
          <FAQs items={entry.data.faqs || []} />
        </div>
      </section>
      {entries.some(
        (item) => item.kind === "TESTIMONIAL" && item.data.verified,
      ) && (
        <section className="section container">
          <span className="eyebrow">Client perspectives</span>
          <h2>In their own words.</h2>
          <div className="card-grid">
            {entries
              .filter(
                (item) => item.kind === "TESTIMONIAL" && item.data.verified,
              )
              .map((item) => (
                <figure className="service-card" key={item.id}>
                  <blockquote>{item.excerpt}</blockquote>
                  <figcaption>
                    <strong>{item.title}</strong>
                    {item.data.role && <p>{item.data.role}</p>}
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      )}
      {entries.some((e) => e.kind === "BLOG") && (
        <section className="section container insights-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{copy("text84")}</span>
              <h2>{copy("text85")}</h2>
            </div>
            <Link className="text-link" href="/blog/">
              {copy("text86")} ↗
            </Link>
          </div>
          <Cards
            entries={entries.filter((e) => e.kind === "BLOG").slice(0, 3)}
          />
        </section>
      )}
      <CTA />
    </>
  );
}
