import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAllContent, isPublished } from "@/lib/content";
import { kinds } from "@/lib/types";
export default async function ContentList({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; q?: string }>;
}) {
  await requireAdmin();
  const { kind, q } = await searchParams;
  const all = await getAllContent();
  const entries = all.filter(
    (e) =>
      (!kind || e.kind === kind) &&
      (!q || `${e.title} ${e.slug}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <>
      <div className="admin-top">
        <h1>{kind?.replaceAll("_", " ") || "All content"}</h1>
        <Link
          href={`/admin/content/new/?kind=${kind || "PAGE"}`}
          className="button"
        >
          Create content +
        </Link>
      </div>
      <form className="admin-panel form-grid">
        <label>
          Content type
          <select name="kind" defaultValue={kind || ""}>
            <option value="">All content</option>
            {kinds.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label>
          Search
          <input name="q" defaultValue={q} />
        </label>
        <button className="button button-small">Filter</button>
      </form>
      <div className="admin-panel table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title / path</th>
              <th>Type</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>
                  <Link href={`/admin/content/${e.id}/`}>{e.title}</Link>
                  <br />
                  <span className="small muted">
                    /{e.slug}
                    {e.slug ? "/" : ""}
                  </span>
                </td>
                <td>{e.kind}</td>
                <td>
                  <span className="status">
                    {isPublished(e)
                      ? "PUBLISHED"
                      : e.status === "PUBLISHED"
                        ? "SCHEDULED"
                        : "DRAFT"}
                  </span>
                </td>
                <td>{e.sortOrder}</td>
                <td>
                  <Link href={`/admin/content/${e.id}/`}>Edit</Link> ·{" "}
                  <Link href={`/admin/preview/${e.id}/`}>Preview</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!entries.length && (
          <p className="admin-empty">
            No content yet. Create a draft to get started.
          </p>
        )}
      </div>
    </>
  );
}
