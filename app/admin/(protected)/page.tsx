import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { db } from "@/lib/db";
import { getAllContent, getPublished } from "@/lib/content";
import { auditEntries } from "@/lib/seo";
export default async function Overview() {
  await requireAdmin();
  const [entries, published, leads, media] = await Promise.all([
    getAllContent(),
    getPublished(),
    db.lead.count({ where: { status: "NEW" } }),
    db.media.count(),
  ]);
  const issues = auditEntries(published).filter((r) => r.warnings.length);
  return (
    <>
      <div className="admin-top">
        <h1>Website overview</h1>
        <Link href="/admin/content/new/" className="button">
          Create content +
        </Link>
      </div>
      <div className="admin-stats">
        {[
          [published.length, "Published records"],
          [entries.filter((e) => e.status === "DRAFT").length, "Drafts"],
          [leads, "New enquiries"],
          [media, "Media files"],
        ].map(([value, label]) => (
          <div className="admin-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="admin-panel">
        <h2>Your publishing workspace</h2>
        <p>
          Manage business content, review SEO warnings and publish when the
          information is ready. Case studies and testimonials require factual
          verification before publishing.
        </p>
        <div className="button-row">
          <Link className="text-link" href="/admin/content/">
            Manage content ↗
          </Link>
          <Link className="text-link" href="/admin/leads/">
            Review enquiries ↗
          </Link>
          <Link className="text-link" href="/admin/settings/">
            Company & tracking settings ↗
          </Link>
        </div>
      </div>
      <div className="admin-panel">
        <h2>SEO maintenance</h2>
        <p>
          {issues.length} published records have warnings or review notes. Some
          warnings, such as a short collection introduction, require editorial
          judgement.
        </p>
        <Link className="button button-outline" href="/admin/seo-audit/">
          Review SEO audit ↗
        </Link>
      </div>
      <div className="notice">
        Before launch: review legal pages, confirm company contact details,
        configure the production database and storage, test enquiry delivery,
        and verify DNS/HTTPS. See README.md for the deployment checklist.
      </div>
    </>
  );
}
