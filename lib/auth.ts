import "server-only";
import { cache } from "react";
import {
  createHash,
  randomBytes,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, hasDatabase } from "./db";
const cookieName = "hashturn_session";
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32)
    throw new Error("AUTH_SECRET must contain at least 32 random characters");
  return s;
}
export const currentUser = cache(async () => {
  if (!hasDatabase()) return null;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: hash(token) },
    include: { user: true },
  });
  return session &&
    session.expiresAt > new Date() &&
    session.user.role === "ADMIN"
    ? session.user
    : null;
});
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/admin/login/");
  return user;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await db.session.create({
    data: {
      id: hash(token),
      userId,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}
export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) await db.session.deleteMany({ where: { id: hash(token) } });
  jar.delete(cookieName);
}
export async function sameOrigin() {
  const h = await headers();
  const source = h.get("origin");
  const host = h.get("host");
  if (!source || new URL(source).host !== host)
    throw new Error("Invalid request origin");
}
export async function rateLimit(
  scope: string,
  limit: number,
  windowMs: number,
  identity?: string,
) {
  const h = await headers();
  const ip =
    process.env.TRUST_PROXY === "true"
      ? h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
      : "shared";
  const key = hash(`${scope}:${identity || ip}`);
  const now = new Date();
  const resetAt = new Date(Date.now() + windowMs);
  const rows = await db.$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateLimit" ("key", "count", "resetAt") VALUES (${key}, 1, ${resetAt}) ON CONFLICT ("key") DO UPDATE SET "count" = CASE WHEN "RateLimit"."resetAt" < ${now} THEN 1 ELSE "RateLimit"."count" + 1 END, "resetAt" = CASE WHEN "RateLimit"."resetAt" < ${now} THEN ${resetAt} ELSE "RateLimit"."resetAt" END RETURNING "count"`;
  return rows[0].count <= limit;
}
export function challenge() {
  const payload = `${Date.now()}.${randomBytes(12).toString("hex")}`;
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("hex")}`;
}
export function verifyChallenge(value: string) {
  const [time, nonce, signature] = value.split(".");
  if (!time || !nonce || !signature) return false;
  const age = Date.now() - Number(time);
  if (!Number.isFinite(age) || age < 2000 || age > 3600000) return false;
  const expected = createHmac("sha256", secret())
    .update(`${time}.${nonce}`)
    .digest("hex");
  return (
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
}
