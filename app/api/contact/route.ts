import { NextResponse } from "next/server";
import { db, hasDatabase } from "@/lib/db";
import {
  challenge,
  verifyChallenge,
  sameOrigin,
  rateLimit,
  hash,
} from "@/lib/auth";
import { leadSchema } from "@/lib/validation";
export async function GET() {
  if (!hasDatabase() || !process.env.AUTH_SECRET)
    return NextResponse.json(
      {
        error:
          "Online enquiries are not configured yet. Please check back soon.",
      },
      { status: 503 },
    );
  try {
    return NextResponse.json(
      { challenge: challenge() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Online enquiries are temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function POST(request: Request) {
  try {
    await sameOrigin();
    if (!hasDatabase())
      return NextResponse.json(
        { error: "Online enquiries are not configured yet." },
        { status: 503 },
      );
    if (Number(request.headers.get("content-length")) > 20000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const input = leadSchema.safeParse(await request.json());
    if (!input.success)
      return NextResponse.json(
        {
          error:
            "Please enter your name, company, valid email, project type and at least 20 characters about your project.",
        },
        { status: 400 },
      );
    const { website, challenge: token, ...lead } = input.data;
    if (website) return NextResponse.json({ ok: true });
    if (!verifyChallenge(token))
      return NextResponse.json(
        {
          error:
            "Please allow a few seconds before submitting, or refresh the page if it has been open for an hour.",
        },
        { status: 400 },
      );
    if (
      !(await rateLimit("contact", 10, 3600000)) ||
      !(await rateLimit(
        "contact-email",
        3,
        3600000,
        hash(lead.email.toLowerCase()),
      ))
    )
      return NextResponse.json(
        { error: "Too many enquiries. Please try again later." },
        { status: 429 },
      );
    const used = await db.rateLimit.createMany({
      data: [
        {
          key: `challenge:${hash(token)}`,
          count: 1,
          resetAt: new Date(Date.now() + 3600000),
        },
      ],
      skipDuplicates: true,
    });
    if (!used.count)
      return NextResponse.json(
        {
          error:
            "This form has already been submitted. Refresh to start a new enquiry.",
        },
        { status: 409 },
      );
    await db.lead.create({ data: lead });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Your enquiry could not be saved. Please try again later." },
      { status: 503 },
    );
  }
}
