import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { currentUser, sameOrigin } from "@/lib/auth";
import { contentSchema } from "@/lib/validation";
import { refreshContent } from "@/lib/cache";
import { canonicalAfterRename } from "@/lib/canonical";
function taxonomySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export async function POST(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const parsed = contentSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        {
          error: parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; "),
        },
        { status: 400 },
      );
    const { id, data, seo, publishedAt, ...fields } = parsed.data;
    if (fields.kind === "DEVELOPER") fields.kind = "TEAM";
    const categories = [...new Set((data.categoryNames || []).filter(Boolean))];
    const tags = [...new Set((data.tagNames || []).filter(Boolean))];
    if ([...categories, ...tags].some((n) => !taxonomySlug(n)))
      return NextResponse.json(
        { error: "Categories and tags need at least one letter or number." },
        { status: 400 },
      );
    const saved = await db.$transaction(async (tx) => {
      const old = id ? await tx.content.findUnique({ where: { id } }) : null;
      const related = await tx.content.findMany({
        where: {
          slug: { in: data.related || [] },
          ...(id ? { id: { not: id } } : {}),
        },
        select: { id: true },
      });
      const record = {
        ...fields,
        data: data as Prisma.InputJsonValue,
        seo: canonicalAfterRename(
          seo,
          old?.slug,
          fields.slug,
        ) as Prisma.InputJsonValue,
        publishedAt: publishedAt
          ? new Date(publishedAt)
          : fields.status === "PUBLISHED"
            ? new Date()
            : null,
        related: { set: related },
        categories: {
          set: [],
          connectOrCreate: categories.map((name) => ({
            where: { slug: taxonomySlug(name) },
            create: { name, slug: taxonomySlug(name) },
          })),
        },
        tags: {
          set: [],
          connectOrCreate: tags.map((name) => ({
            where: { slug: taxonomySlug(name) },
            create: { name, slug: taxonomySlug(name) },
          })),
        },
      };
      const row = id
        ? await tx.content.update({ where: { id }, data: record })
        : await tx.content.create({
            data: {
              ...record,
              related: { connect: related },
              categories: {
                connectOrCreate: record.categories.connectOrCreate,
              },
              tags: { connectOrCreate: record.tags.connectOrCreate },
            },
          });
      if (old && old.slug !== row.slug) {
        const oldPath = old.slug ? `/${old.slug}/` : "/";
        const newPath = row.slug ? `/${row.slug}/` : "/";
        await tx.redirect.deleteMany({ where: { source: newPath } });
        await tx.redirect.updateMany({
          where: { destination: oldPath },
          data: { destination: newPath },
        });
        await tx.redirect.upsert({
          where: { source: oldPath },
          create: { source: oldPath, destination: newPath, statusCode: 301 },
          update: { destination: newPath, active: true },
        });
        await tx.navigationItem.updateMany({
          where: { href: oldPath },
          data: { href: newPath },
        });
      }
      return row;
    });
    refreshContent();
    return NextResponse.json({ id: saved.id });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return NextResponse.json(
        { error: "This slug or taxonomy name already exists." },
        { status: 409 },
      );
    return NextResponse.json(
      { error: "Unable to save content. Check the database and input." },
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
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const content = await db.content.findUnique({ where: { id } });
    if (!content)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!content.slug)
      return NextResponse.json(
        {
          error:
            "The homepage cannot be deleted. Edit or unpublish it instead.",
        },
        { status: 400 },
      );
    await db.content.delete({ where: { id } });
    refreshContent();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete content." },
      { status: 400 },
    );
  }
}
