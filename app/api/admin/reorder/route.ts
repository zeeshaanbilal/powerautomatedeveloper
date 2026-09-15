import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { refreshContent } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { updates } = await req.json();

    if (!Array.isArray(updates)) {
      return Response.json({ error: "Invalid updates array" }, { status: 400 });
    }

    // Execute updates in a transaction
    await db.$transaction(
      updates.map((update: { id: string; sortOrder: number }) =>
        db.content.update({
          where: { id: update.id },
          data: { sortOrder: update.sortOrder },
        })
      )
    );

    refreshContent();
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
