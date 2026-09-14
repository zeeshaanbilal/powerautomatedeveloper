import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser, sameOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const { id, ...data } = z
      .object({
        id: z.string(),
        status: z.enum([
          "NEW",
          "REVIEWING",
          "CONTACTED",
          "QUALIFIED",
          "CLOSED",
        ]),
        notes: z.string().max(20000),
      })
      .parse(await request.json());
    await db.lead.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to update lead." },
      { status: 400 },
    );
  }
}
export async function DELETE(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw Error();
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete lead." },
      { status: 400 },
    );
  }
}
