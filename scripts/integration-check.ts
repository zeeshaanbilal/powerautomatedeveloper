import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
const db = new PrismaClient();
const base = process.env.AUDIT_URL || "http://localhost:3000";
const suffix = Date.now().toString(36);
const slug = `qa-validation-${suffix}`;
const completed: string[] = [];
async function main() {
  const credentials = await readFile(".admin-credentials.txt", "utf8");
  const email = credentials.match(/^Email: (.+)$/m)?.[1];
  const password = credentials.match(/^Password: (.+)$/m)?.[1];
  assert.ok(email && password, "Local administrator credentials are missing");
  let cookie = "";
  let contentId = "";
  let mediaId = "";
  let leadId = "";
  let redirectId = "";
  const call = (path: string, method = "GET", data?: unknown, origin = base) =>
    fetch(base + path, {
      method,
      headers: {
        Origin: origin,
        ...(cookie ? { Cookie: cookie } : {}),
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body:
        data instanceof FormData
          ? data
          : data === undefined
            ? undefined
            : JSON.stringify(data),
      redirect: "manual",
    });
  try {
    const login = await call("/api/admin/auth/", "POST", { email, password });
    assert.equal(login.status, 200, "Login failed");
    cookie = login.headers.get("set-cookie")?.split(";")[0] || "";
    assert.ok(cookie);
    assert.ok(login.headers.get("set-cookie")?.includes("HttpOnly"));
    assert.ok(login.headers.get("set-cookie")?.includes("Secure"));
    completed.push("Password login and secure session cookie");
    assert.equal((await call("/admin/")).status, 200);
    completed.push("Authenticated dashboard");
    const value = {
      kind: "PAGE",
      slug,
      title: "QA validation page",
      excerpt:
        "Temporary technical verification content. This record is removed when the integration check finishes.",
      body: "<p>Integration check <strong>content</strong>.</p><script>alert(1)</script>",
      status: "DRAFT",
      publishedAt: null,
      sortOrder: 9999,
      featuredImage: "",
      imageAlt: "",
      seo: {
        title: `QA validation ${suffix} | HashTurn`,
        description: `Temporary integration verification ${suffix}.`,
        canonical: `https://powerautomatedeveloper.com/${slug}/`,
        ogImage: "/opengraph-image",
        schemaEnabled: true,
      },
      data: { sections: [], faqs: [], related: [] },
    };
    assert.equal(
      (
        await call(
          "/api/admin/content/",
          "POST",
          value,
          "https://untrusted.example",
        )
      ).status,
      400,
    );
    completed.push("Cross-origin mutation rejected");
    const created = await call("/api/admin/content/", "POST", value);
    assert.equal(created.status, 200, await created.clone().text());
    contentId = (await created.json()).id;
    const stored = await db.content.findUniqueOrThrow({
      where: { id: contentId },
    });
    assert.ok(!stored.body.includes("<script"));
    assert.equal((await call(`/${slug}/`)).status, 404);
    assert.ok(
      !(await (await call("/sitemap.xml")).text()).includes(`/${slug}/`),
    );
    completed.push("Draft creation, sanitization and private draft route");
    assert.equal((await call(`/admin/preview/${contentId}/`)).status, 200);
    completed.push("Authenticated draft preview");
    const scheduled = {
      ...value,
      id: contentId,
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() + 86400000).toISOString(),
    };
    assert.equal(
      (await call("/api/admin/content/", "POST", scheduled)).status,
      200,
    );
    assert.equal((await call(`/${slug}/`)).status, 404);
    completed.push("Future publication remains private");
    const published = {
      ...scheduled,
      publishedAt: new Date(Date.now() - 10000).toISOString(),
    };
    assert.equal(
      (await call("/api/admin/content/", "POST", published)).status,
      200,
    );
    assert.equal((await call(`/${slug}/`)).status, 200);
    assert.ok(
      (await (await call("/sitemap.xml")).text()).includes(`/${slug}/`),
    );
    completed.push("Publication updates page and sitemap");
    const redirect = await call("/api/admin/manage/redirects/", "POST", {
      source: `/qa-old-${suffix}/`,
      destination: `/${slug}/`,
      statusCode: 301,
      active: true,
    });
    assert.equal(redirect.status, 200);
    redirectId = (await redirect.json()).id;
    const redirected = await call(`/qa-old-${suffix}/`);
    assert.equal(redirected.status, 301);
    assert.ok(redirected.headers.get("location")?.endsWith(`/${slug}/`));
    completed.push("301 redirect manager");
    const input = await sharp({
      create: { width: 24, height: 24, channels: 3, background: "#087f70" },
    })
      .png()
      .toBuffer();
    const form = new FormData();
    form.set(
      "file",
      new Blob([new Uint8Array(input)], { type: "image/png" }),
      "qa-image.png",
    );
    form.set("alt", "Temporary integration check image");
    form.set("title", "QA verification");
    form.set("caption", "");
    const uploaded = await call("/api/admin/media/", "POST", form);
    assert.equal(uploaded.status, 200, await uploaded.clone().text());
    const media = await uploaded.json();
    mediaId = media.id;
    assert.equal(media.format, "webp");
    const image = await call(media.url);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get("content-type"), "image/webp");
    completed.push("Neon media upload, WebP conversion and download");
    const challenge = await (await call("/api/contact/")).json();
    assert.ok(challenge.challenge);
    await new Promise((resolve) => setTimeout(resolve, 2100));
    const contact = {
      name: "QA Verification",
      company: "Internal website QA",
      email: `qa-${suffix}@example.com`,
      phone: "",
      projectType: "Technical verification",
      services: ["Power Automate"],
      description:
        "Temporary internal integration test. This enquiry will be removed automatically.",
      budget: "",
      timeline: "",
      website: "",
      challenge: challenge.challenge,
    };
    const sent = await call("/api/contact/", "POST", contact);
    assert.equal(sent.status, 200, await sent.clone().text());
    const lead = await db.lead.findFirstOrThrow({
      where: { email: contact.email },
    });
    leadId = lead.id;
    assert.equal(
      (
        await call("/api/admin/leads/", "POST", {
          id: leadId,
          status: "REVIEWING",
          notes: "Temporary verification",
        })
      ).status,
      200,
    );
    assert.equal((await call("/api/contact/", "POST", contact)).status, 409);
    completed.push("Enquiry persistence, lead management and replay rejection");
    assert.equal((await call("/admin/seo-audit/")).status, 200);
    completed.push("Authenticated SEO audit");
  } finally {
    if (leadId) await db.lead.deleteMany({ where: { id: leadId } });
    if (redirectId) await db.redirect.deleteMany({ where: { id: redirectId } });
    if (contentId) {
      const removed = await call(
        `/api/admin/content/?id=${contentId}`,
        "DELETE",
      );
      assert.equal(removed.status, 200, "Unable to clean up QA content");
    }
    if (mediaId) {
      const removed = await call(`/api/admin/media/?id=${mediaId}`, "DELETE");
      if (removed.status !== 200) throw Error("Unable to clean up QA media");
    }
    if (cookie) {
      const logout = await call("/api/admin/auth/", "DELETE");
      assert.equal(logout.status, 200);
      assert.equal((await call("/api/admin/content/", "POST", {})).status, 401);
      completed.push("Session invalidation on logout");
    }
    await db.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } });
    await mkdir("artifacts", { recursive: true });
    await writeFile(
      "artifacts/integration-check.json",
      JSON.stringify(
        { completed, checkedAt: new Date().toISOString() },
        null,
        2,
      ),
    );
  }
  console.log(
    JSON.stringify({ passed: completed.length, checks: completed }, null, 2),
  );
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
