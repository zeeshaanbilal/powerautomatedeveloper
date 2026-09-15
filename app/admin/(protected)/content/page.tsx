import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { getAllContent, isPublished } from "@/lib/content";
import { adminKinds } from "@/lib/types";
import { SortableContentList } from "@/components/admin/sortable-content-list";
export default async function ContentList({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; q?: string }>;
}) {
  await requireAdmin();
  const { kind: requestedKind, q } = await searchParams;
  const kind = requestedKind === "DEVELOPER" ? "TEAM" : requestedKind;
  const all = await getAllContent();
  const entries = all.filter(
    (e) =>
      (!kind ||
        e.kind === kind ||
        (kind === "TEAM" && e.kind === "DEVELOPER")) &&
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
            {adminKinds.map((k) => (
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
        <SortableContentList 
          initialEntries={entries.map((e) => ({
            id: e.id,
            title: e.title,
            slug: e.slug,
            kind: e.kind === "DEVELOPER" ? "TEAM" : e.kind,
            statusString: isPublished(e) ? "PUBLISHED" : e.status === "PUBLISHED" ? "SCHEDULED" : "DRAFT",
            sortOrder: e.sortOrder
          }))}
        />
      </div>
    </>
  );
}
