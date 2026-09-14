import { NextResponse } from "next/server";
import { putMedia, deleteMedia } from "@/lib/storage";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser, sameOrigin } from "@/lib/auth";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    if (Number(request.headers.get("content-length")) > 9 * 1024 * 1024)
      return NextResponse.json(
        { error: "Maximum file size is 8 MB." },
        { status: 413 },
      );
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 8 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      return NextResponse.json(
        { error: "Choose a JPEG, PNG or WebP image below 8 MB." },
        { status: 400 },
      );
    const meta = z
      .object({
        alt: z.string().min(1).max(500),
        title: z.string().max(200),
        caption: z.string().max(1000),
      })
      .parse({
        alt: form.get("alt"),
        title: form.get("title") || "",
        caption: form.get("caption") || "",
      });
    const input = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(input, {
      limitInputPixels: 40000000,
    }).metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || ""))
      throw Error("Invalid image format");
    const { data, info } = await sharp(input, { limitInputPixels: 40000000 })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
    const filename = randomUUID() + ".webp";
    await putMedia(filename, data);
    try {
      const media = await db.media.create({
        data: {
          ...meta,
          filename,
          url: `/uploads/${filename}`,
          width: info.width,
          height: info.height,
          bytes: info.size,
          format: "webp",
        },
      });
      return NextResponse.json(media);
    } catch (error) {
      await deleteMedia(filename);
      throw error;
    }
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to upload. Check image format, alt text and persistent media storage.",
      },
      { status: 400 },
    );
  }
}
export async function PATCH(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const { id, ...data } = z
      .object({
        id: z.string(),
        alt: z.string().max(500),
        title: z.string().max(200),
        caption: z.string().max(1000),
      })
      .parse(await request.json());
    await db.media.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to update metadata." },
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
    const media = await db.media.findUnique({ where: { id } });
    if (!media) throw Error();
    const [entries, settings] = await Promise.all([
      db.content.findMany({
        select: { body: true, data: true, seo: true, featuredImage: true },
      }),
      db.siteSettings.findUnique({ where: { id: "site" } }),
    ]);
    if (JSON.stringify([entries, settings]).includes(media.url))
      return NextResponse.json(
        {
          error:
            "This image is referenced by content or settings. Remove those references first.",
        },
        { status: 409 },
      );
    await deleteMedia(media.filename);
    await db.media.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete media." },
      { status: 400 },
    );
  }
}
