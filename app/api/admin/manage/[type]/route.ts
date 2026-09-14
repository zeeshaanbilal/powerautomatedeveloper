import { NextResponse } from "next/server";
import { currentUser, sameOrigin } from "@/lib/auth";
import { db } from "@/lib/db";
import { refreshContent } from "@/lib/cache";
import { managerModels, type Manager } from "@/lib/admin-models";
type Params = { params: Promise<{ type: string }> };
export async function POST(request: Request, { params }: Params) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const { type } = await params;
    if (!Object.hasOwn(managerModels, type))
      return NextResponse.json(
        { error: "Unknown collection" },
        { status: 404 },
      );
    const input = await request.json();
    const id = typeof input.id === "string" ? input.id : undefined;
    const result = managerModels[type as Manager].schema.safeParse(input);
    if (!result.success)
      return NextResponse.json(
        {
          error: result.error.issues
            .map((i) => `${i.path}: ${i.message}`)
            .join("; "),
        },
        { status: 400 },
      );
    let record;
    if (type === "categories") {
      const data = managerModels.categories.schema.parse(input);
      record = id
        ? await db.category.update({ where: { id }, data })
        : await db.category.create({ data });
    } else if (type === "tags") {
      const data = managerModels.tags.schema.parse(input);
      record = id
        ? await db.tag.update({ where: { id }, data })
        : await db.tag.create({ data });
    } else if (type === "navigation") {
      const data = managerModels.navigation.schema.parse(input);
      const slug = data.href.replace(/^\/|\/$/g, "");
      const target = await db.content.findUnique({ where: { slug } });
      if (
        !target ||
        target.status !== "PUBLISHED" ||
        (target.publishedAt && target.publishedAt > new Date())
      )
        return NextResponse.json(
          { error: "Navigation must link to a currently published page." },
          { status: 400 },
        );
      record = id
        ? await db.navigationItem.update({ where: { id }, data })
        : await db.navigationItem.create({ data });
    } else if (type === "redirects") {
      const data = managerModels.redirects.schema.parse(input);
      if (
        data.source === data.destination ||
        /^\/(admin|api)(\/|$)/.test(data.source) ||
        /^\/(admin|api)(\/|$)/.test(data.destination)
      )
        return NextResponse.json(
          { error: "Invalid or private redirect path." },
          { status: 400 },
        );
      const target = await db.content.findUnique({
        where: { slug: data.destination.replace(/^\/|\/$/g, "") },
      });
      if (
        !target ||
        target.status !== "PUBLISHED" ||
        (target.publishedAt && target.publishedAt > new Date())
      )
        return NextResponse.json(
          { error: "Destination must be a currently published page." },
          { status: 400 },
        );
      const conflict = await db.redirect.findFirst({
        where: {
          active: true,
          ...(id ? { id: { not: id } } : {}),
          OR: [{ source: data.destination }, { destination: data.source }],
        },
      });
      if (conflict)
        return NextResponse.json(
          { error: "This would create a redirect chain or loop." },
          { status: 400 },
        );
      record = id
        ? await db.redirect.update({ where: { id }, data })
        : await db.redirect.create({ data });
    } else {
      const data = managerModels.growth.schema.parse(input);
      record = id
        ? await db.growthOpportunity.update({ where: { id }, data })
        : await db.growthOpportunity.create({ data });
    }
    refreshContent();
    return NextResponse.json(record);
  } catch {
    return NextResponse.json(
      { error: "Unable to save. Check for duplicate names or paths." },
      { status: 400 },
    );
  }
}
export async function DELETE(request: Request, { params }: Params) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const { type } = await params;
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    if (type === "categories") await db.category.delete({ where: { id } });
    else if (type === "tags") await db.tag.delete({ where: { id } });
    else if (type === "navigation")
      await db.navigationItem.delete({ where: { id } });
    else if (type === "redirects") await db.redirect.delete({ where: { id } });
    else if (type === "growth")
      await db.growthOpportunity.delete({ where: { id } });
    else
      return NextResponse.json(
        { error: "Unknown collection" },
        { status: 404 },
      );
    refreshContent();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete record." },
      { status: 400 },
    );
  }
}
