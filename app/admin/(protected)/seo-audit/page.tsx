import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db";
import { getPublished, publicPath } from "@/lib/content";
import { auditEntries } from "@/lib/seo";
export default async function Audit() {
  await requireAdmin();
  const [entries, redirects, nav] = await Promise.all([
    getPublished(),
    db.redirect.findMany({ where: { active: true } }),
    db.navigationItem.findMany({ where: { active: true } }),
  ]);
  const rows = auditEntries(entries);
  const paths = new Set(entries.map((e) => publicPath(e.slug)));
  const brokenNav = nav.filter((n) => !paths.has(n.href));
  const redirectIssues = redirects.filter(
    (r) =>
      r.source === r.destination ||
      redirects.some(
        (other) => other.id !== r.id && other.source === r.destination,
      ) ||
      !paths.has(r.destination),
  );
  const counts = [
    ["Indexable pages", rows.filter((r) => !r.noindex).length],
    [
      "Missing titles",
      rows.filter((r) => r.warnings.includes("Missing title")).length,
    ],
    [
      "Missing descriptions",
      rows.filter((r) => r.warnings.includes("Missing meta description"))
        .length,
    ],
    [
      "Missing canonicals",
      rows.filter((r) => r.warnings.includes("Missing canonical")).length,
    ],
    [
      "Missing page OG images",
      rows.filter((r) =>
        r.warnings.some((w) => w.startsWith("Missing page OG")),
      ).length,
    ],
    [
      "Missing alt text",
      rows.filter((r) => r.warnings.some((w) => w.includes("alt text"))).length,
    ],
    [
      "Missing H1",
      rows.filter((r) => r.warnings.includes("Missing H1")).length,
    ],
    [
      "Duplicate titles",
      rows.filter((r) => r.warnings.includes("Duplicate title")).length,
    ],
    [
      "Duplicate descriptions",
      rows.filter((r) => r.warnings.includes("Duplicate description")).length,
    ],
    [
      "Broken content links",
      rows.reduce(
        (sum, r) =>
          sum + r.warnings.filter((w) => w.startsWith("Broken link")).length,
        0,
      ),
    ],
    ["Broken navigation", brokenNav.length],
    [
      "Missing schema",
      rows.filter((r) => r.warnings.includes("Missing schema")).length,
    ],
    ["Redirect issues", redirectIssues.length],
    ["Noindex pages", rows.filter((r) => r.noindex).length],
  ];
  return (
    <>
      <div className="admin-top">
        <h1>SEO audit</h1>
      </div>
      <div className="notice">
        This audit inspects published CMS records and links. Run{" "}
        <code>npm run audit</code> against the running server for rendered
        metadata, routes and image checks. Search engine indexing and Core Web
        Vitals require production verification.
      </div>
      <div className="admin-stats">
        {counts.map(([label, count]) => (
          <div className="admin-stat" key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Discovery files</h2>
        <p>
          <a
            className="text-link"
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
          >
            Open live sitemap ↗
          </a>{" "}
          ·{" "}
          <a
            className="text-link"
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
          >
            Open robots.txt ↗
          </a>
        </p>
        <p className="small">
          Sitemap eligibility: published, publication time reached, indexable,
          self-canonical public records. Admin and private routes are excluded.
          Both endpoint responses are checked by the runtime audit.
        </p>
        {brokenNav.map((n) => (
          <p key={n.id}>
            Broken navigation: {n.label} → {n.href}
          </p>
        ))}
        {redirectIssues.map((r) => (
          <p key={r.id}>
            Redirect issue: {r.source} → {r.destination}
          </p>
        ))}
      </div>
      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Review notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/admin/content/${r.id}/`}>{r.title}</Link>
                  <br />
                  <span className="small">/{r.slug}</span>
                </td>
                <td>
                  {r.warnings.length ? (
                    <ul className="warning-list">
                      {r.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    "No basic warnings"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
