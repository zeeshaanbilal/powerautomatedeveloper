import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { LeadsManager } from "@/components/admin/leads-manager";
export default async function Leads() {
  await requireAdmin();
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return (
    <>
      <div className="admin-top">
        <h1>Contact leads</h1>
      </div>
      <p className="small muted">
        Most recent 500 enquiries. Review and remove personal information
        according to your approved retention policy.
      </p>
      <LeadsManager initial={JSON.parse(JSON.stringify(leads))} />
    </>
  );
}
