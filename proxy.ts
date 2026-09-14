import { NextResponse, NextRequest } from "next/server";
import { db, hasDatabase } from "./lib/db";
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalized =
    pathname === "/" ? "/" : pathname.replace(/\/+$/, "") + "/";
  if (pathname.startsWith("/admin") || pathname.startsWith("/api"))
    return NextResponse.next();
  let destination = normalized;
  let status = 308;
  if (hasDatabase()) {
    const redirect = await db.redirect.findUnique({
      where: { source: normalized },
    });
    if (redirect?.active) {
      destination = redirect.destination;
      status = redirect.statusCode;
    }
  }
  const target = new URL(destination, request.url);
  if (process.env.ENFORCE_CANONICAL === "true") {
    target.protocol = "https:";
    target.host = "powerautomatedeveloper.com";
  }
  if (
    destination !== normalized ||
    (process.env.ENFORCE_CANONICAL === "true" &&
      (request.nextUrl.host !== "powerautomatedeveloper.com" ||
        (request.headers.get("x-forwarded-proto") ||
          request.nextUrl.protocol.replace(":", "")) !== "https"))
  ) {
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, status);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|icon.svg|opengraph-image|sitemap.xml|robots.txt|uploads).*)",
  ],
};
