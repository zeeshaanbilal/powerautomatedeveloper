import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { managerModels, type Manager } from "@/lib/admin-models";
import { RecordManager } from "@/components/admin/record-manager";
export default async function Manage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  await requireAdmin();
  const { type } = await params;
  if (!Object.hasOwn(managerModels, type)) notFound();
  const rows =
    type === "categories"
      ? await db.category.findMany()
      : type === "tags"
        ? await db.tag.findMany()
        : type === "navigation"
          ? await db.navigationItem.findMany({ orderBy: { sortOrder: "asc" } })
          : type === "redirects"
            ? await db.redirect.findMany()
            : await db.growthOpportunity.findMany();
  return (
    <>
      <div className="admin-top">
        <h1>{managerModels[type as Manager].label}</h1>
      </div>
      {type === "growth" && (
        <div className="notice">
          Track legitimate outreach and earned links. This tracker does not send
          messages or create backlinks automatically.
        </div>
      )}
      {type === "redirects" && (
        <div className="notice">
          Use local paths ending in /. Redirect loops, chains, private targets
          and missing destinations are rejected.
        </div>
      )}
      <RecordManager
        type={type as Manager}
        initial={JSON.parse(JSON.stringify(rows))}
      />
    </>
  );
}
