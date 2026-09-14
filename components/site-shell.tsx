import Link from "./safe-link";
import Image from "next/image";
import { getNavigation, getSettings } from "@/lib/content";
import { Brand } from "./brand";
import { Analytics } from "./tracking";
export async function SiteHeader() {
  const [nav, s] = await Promise.all([getNavigation(), getSettings()]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" aria-label={`${s.companyName} home`}>
          {s.logo ? (
            <Image
              src={s.logo}
              width={150}
              height={40}
              alt={s.companyName}
              unoptimized={!s.logo.startsWith("/")}
            />
          ) : (
            <Brand />
          )}
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav
            .filter((n) => !["Home", "Contact"].includes(n.label))
            .map((n) => (
              <Link href={n.href} key={n.id}>
                {n.label}
              </Link>
            ))}
        </nav>
        <Link
          className="button button-small header-cta"
          href={s.consultationUrl}
          data-conversion="consultation_request"
        >
          Let’s talk <span aria-hidden="true">↗</span>
        </Link>
        <details className="mobile-nav">
          <summary aria-label="Toggle navigation">
            Menu <span aria-hidden="true">☰</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {nav.map((n) => (
              <Link key={n.id} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
export async function SiteFooter() {
  const [s, footerNavigation] = await Promise.all([
    getSettings(),
    getNavigation("FOOTER"),
  ]);
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" aria-label="HashTurn home">
              <Brand light />
            </Link>
            <p>
              Thoughtful automation.
              <br />
              Connected business.
            </p>
            <span className="small">{s.companyName}</span>
            {s.email && (
              <p>
                <a href={`mailto:${s.email}`} data-conversion="email_click">
                  {s.email}
                </a>
              </p>
            )}
            {s.phone && (
              <p>
                <a href={`tel:${s.phone}`} data-conversion="phone_click">
                  {s.phone}
                </a>
              </p>
            )}
            {s.address && <p>{s.address}</p>}
          </div>
          <div>
            <h2>Expertise</h2>
            {[
              ["Power Automate", "power-automate-development"],
              ["Power Apps", "power-apps-development"],
              ["SharePoint", "sharepoint-automation"],
              ["Dataverse", "dataverse-development"],
              ["AI automation", "ai-builder"],
              ["API & n8n integrations", "api-integrations"],
            ].map(([label, slug]) => (
              <Link key={slug} href={`/services/${slug}/`}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h2>Work with us</h2>
            <Link href="/hire/power-automate-developer/">Hire a developer</Link>
            <Link href="/hire/power-automate-team/">Hire a team</Link>
            <Link href="/hire/power-automate-consultant/">Consulting</Link>
            <Link href="/industries/">Industries</Link>
            <Link href="/pricing/">Engagement & pricing</Link>
          </div>
          <div>
            <h2>HashTurn</h2>
            <Link href="/about/">About us</Link>
            <Link href="/developers/zeeshan-bilal/">Meet Zeeshan</Link>
            <Link href="/case-studies/">Case studies</Link>
            <Link href="/resources/">Resources</Link>
            <Link href="/contact/">Contact</Link>
            {s.socialLinks.map((l) => (
              <a href={l.url} key={l.url} rel="me">
                {l.label}
              </a>
            ))}
            {footerNavigation.map((item) => (
              <Link key={item.id} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} {s.companyName}
          </span>
          <div>
            <Link href="/privacy-policy/">Privacy</Link>
            <Link href="/terms/">Terms</Link>
            <Link href="/cookie-policy/">Cookies</Link>
            <button type="button" id="analytics-preferences">
              Analytics preferences
            </button>
          </div>
        </div>
      </footer>
      <Analytics id={s.googleAnalyticsId} />
    </>
  );
}
