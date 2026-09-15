import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getAllContent } from "@/lib/content";
import { PageContent } from "@/components/page-content";
import { Home } from "@/components/home";
export default async function Preview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const entries = await getAllContent();
  const { id } = await params;
  const found = entries.find((e) => e.id === id);
  if (!found) notFound();
  return (
    <>
      <div className="admin-top">
        <a href="/admin/content/" style={{ display: "inline-block", marginBottom: "10px", fontSize: "14px", color: "var(--accent)", textDecoration: "none" }}>
          ← Back to all content
        </a>
      </div>
      <div className="admin-panel">
      {!found.slug ? (
        <>
          <div className="preview-banner">Authenticated homepage preview</div>
          <Home entry={found} entries={entries} />
        </>
      ) : (
        <PageContent entry={found} entries={entries} preview />
      )}
    </div>
    </>
  );
}
