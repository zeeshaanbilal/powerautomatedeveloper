import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { MediaManager } from "@/components/admin/media-manager";
export default async function Media() {
  await requireAdmin();
  return (
    <>
      <div className="admin-top">
        <h1>Media library</h1>
      </div>
      <MediaManager
        initial={JSON.parse(
          JSON.stringify(
            await db.media.findMany({ orderBy: { createdAt: "desc" } }),
          ),
        )}
      />
    </>
  );
}
