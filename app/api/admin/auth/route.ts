import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db, hasDatabase } from "@/lib/db";
import {
  sameOrigin,
  rateLimit,
  createSession,
  clearSession,
  secret,
} from "@/lib/auth";
const dummyHash =
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxgvfE.kjMgcpHZxSVo6uKIxaSS";
export async function POST(request: Request) {
  try {
    await sameOrigin();
    if (!hasDatabase())
      return NextResponse.json(
        { error: "Admin is not configured." },
        { status: 503 },
      );
    secret();
    const parsed = z
      .object({
        email: z.email().max(254),
        password: z.string().min(1).max(72),
      })
      .safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 },
      );
    const email = parsed.data.email.toLowerCase();
    if (
      !(await rateLimit("login-ip", 30, 900000)) ||
      !(await rateLimit("login-email", 5, 900000, email))
    )
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    const user = await db.user.findUnique({ where: { email } });
    const valid = await compare(
      parsed.data.password,
      user?.passwordHash || dummyHash,
    );
    if (!user || !valid || user.role !== "ADMIN")
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable." },
      { status: 503 },
    );
  }
}
export async function DELETE() {
  try {
    await sameOrigin();
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign out." }, { status: 400 });
  }
}
