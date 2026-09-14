import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getAllContent } from "@/lib/content";
import { ContentEditor } from "@/components/admin/content-editor";
import { kinds, type Entry, type Kind } from "@/lib/types";
export default async function Edit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { kind } = await searchParams;
  const entries = await getAllContent();
  const prefixes: Record<string, string> = {
    SERVICE: "services/",
    HIRE: "hire/",
    INDUSTRY: "industries/",
    DEVELOPER: "developers/",
    TEAM: "developers/",
    CASE_STUDY: "case-studies/",
    BLOG: "blog/",
    GUIDE: "resources/guides/",
  };
  const type =
    kind === "DEVELOPER"
      ? "TEAM"
      : kinds.includes(kind as Kind)
        ? (kind as Kind)
        : "PAGE";
  const initial =
    id === "new"
      ? {
          id: "",
          kind: type,
          slug: prefixes[type] || "",
          title: "",
          excerpt: "",
          body: "",
          status: "DRAFT",
          publishedAt: null,
          sortOrder: 0,
          featuredImage: "",
          imageAlt: "",
          seo: {
            title: "",
            description: "",
            canonical: "",
            ogImage: "",
            schemaEnabled: true,
          },
          data: { sections: [], faqs: [], related: [] },
          updatedAt: new Date().toISOString(),
        }
      : entries.find((e) => e.id === id);
  if (!initial) notFound();
  if (initial.kind === "DEVELOPER") initial.kind = "TEAM";
  return (
    <>
      <div className="admin-top">
        <h1>{id === "new" ? "Create content" : "Edit content"}</h1>
      </div>
      <ContentEditor
        initial={JSON.parse(JSON.stringify(initial)) as Entry}
        entries={entries.map((e) => ({
          id: e.id,
          slug: e.slug,
          title: e.title,
          seo: e.seo,
          kind: e.kind,
        }))}
      />
    </>
  );
}
