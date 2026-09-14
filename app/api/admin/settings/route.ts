import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser, sameOrigin } from "@/lib/auth";
import { urlField } from "@/lib/validation";
import { refreshContent } from "@/lib/cache";
const schema = z.object({
  companyName: z.string().min(1).max(150),
  email: z.union([z.literal(""), z.email()]),
  phone: z
    .string()
    .max(40)
    .regex(/^[+\d\s().-]*$/),
  address: z.string().max(1000),
  logo: urlField,
  favicon: urlField,
  defaultTitle: z.string().max(200),
  defaultDescription: z.string().max(500),
  defaultOgImage: urlField,
  consultationLabel: z.string().min(1).max(120),
  consultationUrl: z.url().startsWith("https://"),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1).max(60),
        url: z.url().startsWith("https://"),
      }),
    )
    .max(20),
  googleAnalyticsId: z.string().regex(/^(G-[A-Z0-9]+)?$/),
  searchConsoleToken: z
    .string()
    .max(300)
    .regex(/^[a-zA-Z0-9_-]*$/),
  trackingNotes: z.string().max(5000),
});
export async function POST(request: Request) {
  if (!(await currentUser()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await sameOrigin();
    const result = schema.safeParse(await request.json());
    if (!result.success)
      return NextResponse.json(
        {
          error: result.error.issues
            .map((i) => `${i.path}: ${i.message}`)
            .join("; "),
        },
        { status: 400 },
      );
    await db.siteSettings.upsert({
      where: { id: "site" },
      create: { id: "site", value: result.data },
      update: { value: result.data },
    });
    refreshContent();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save settings." },
      { status: 400 },
    );
  }
}
