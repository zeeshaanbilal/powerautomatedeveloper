import { createPrismaClient } from "../lib/prisma-client";
import { readFile } from "node:fs/promises";
const db = createPrismaClient();
const origin = "http://localhost:3000";
const samples = [
  {
    slug: "planning-your-first-automation",
    title: "Before you automate: map the work that matters",
    excerpt:
      "A practical starting point for turning a repetitive business process into a clear automation brief.",
    image: "automation-strategy",
    alt: "Blue and translucent glass blocks arranged as ascending steps",
    category: "Automation Strategy",
    sections: [
      {
        title: "Start with the process",
        text: "Choose one recurring task and describe it from beginning to end. Record what starts the work, which information arrives, who makes decisions and what a completed task looks like. The aim is to give everyone the same understanding before discussing tools.",
      },
      {
        title: "Make exceptions visible",
        text: "An ordinary request is only part of the picture. Consider missing information, duplicate submissions, an unavailable approver and a connected system being offline. Write down who should be notified and what can safely wait for a retry.",
      },
      {
        title: "Define a useful first release",
        text: "Keep the first scope reviewable. A single approval process with clear ownership is easier to evaluate than an entire department's workload. Agree how the team will test the process, review the output and decide what to improve next.",
      },
      {
        title: "Prepare your automation brief",
        text: "Bring a process diagram, an anonymized example input, a list of systems and the people responsible for them. Include access constraints and any delivery deadlines. These details help a developer ask better questions and identify dependencies early.",
      },
    ],
    related: [
      "services/business-process-automation",
      "hire/power-automate-consultant",
    ],
  },
  {
    slug: "document-workflow-planning-checklist",
    title: "Designing a clearer document approval workflow",
    excerpt:
      "From incoming files to review and handover: the decisions to make before building a document workflow.",
    image: "automation-documents",
    alt: "Blue ribbons connecting translucent glass document panels",
    category: "Power Automate",
    sections: [
      {
        title: "Agree where documents arrive",
        text: "List the entry points for a document: a shared library, a form or an inbox. Decide which location holds the working copy and who can access it. A consistent starting point makes the rest of the process easier to explain and maintain.",
      },
      {
        title: "Separate capture from approval",
        text: "Collecting information and approving a decision are different responsibilities. Identify which fields are required, who checks them and what happens when information is incomplete. Keep a clear route back to the person who submitted the document.",
      },
      {
        title: "Plan for changes and delays",
        text: "An approver may be away, a file may be replaced or a request may need further review. Define the expected behavior for each situation. Avoid assuming that every request will follow the shortest path to completion.",
      },
      {
        title: "Make the handover understandable",
        text: "Document the process owner, the supported document types and the agreed support route. Use anonymized examples during review so the people operating the process can explain what happens at each stage.",
      },
    ],
    related: ["services/document-automation", "services/sharepoint-automation"],
  },
  {
    slug: "connecting-business-systems",
    title: "Connected systems start with the right questions",
    excerpt:
      "A planning checklist for sharing information between your CRM, Microsoft 365 and everyday business tools.",
    image: "connected-systems",
    alt: "Interlocking cobalt and frosted glass rings with connected white cubes",
    category: "API Integrations",
    sections: [
      {
        title: "Name the source of truth",
        text: "When the same customer or project exists in two systems, agree which system owns each piece of information. Different fields can have different owners. Writing this down avoids ambiguous updates and makes later troubleshooting more straightforward.",
      },
      {
        title: "Decide when information should move",
        text: "Some processes need information soon after a change; others can run on an agreed schedule. Start with the business requirement and the capabilities of the systems involved. A clear timing expectation is more useful than a vague request to keep everything synchronized.",
      },
      {
        title: "Consider duplicates and failures",
        text: "A request can be repeated or arrive with incomplete information. Decide how records will be matched, how a failed update will be reviewed and who can correct a mismatch. Include these scenarios in the test plan.",
      },
      {
        title: "Prepare for an integration discussion",
        text: "Share the system names, the records that need to move and an anonymized example. Identify the administrators who can confirm access and the people who understand the business rules. Keep passwords and customer data out of the initial project enquiry.",
      },
    ],
    related: ["services/api-integrations", "services/crm-automation"],
  },
];
async function main() {
  const credentials = await readFile(".admin-credentials.txt", "utf8");
  const email = credentials.match(/^Email: (.+)$/m)?.[1]?.trim();
  const password = credentials.match(/^Password: (.+)$/m)?.[1]?.trim();
  let cookie = "";
  const call = async (path: string, data?: unknown, method = "POST") => {
    const response = await fetch(origin + path, {
      method,
      headers: {
        Origin: origin,
        Cookie: cookie,
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
    });
    if (!response.ok) throw Error(`${path} failed (${response.status})`);
    return response;
  };
  const login = await call("/api/admin/auth/", { email, password });
  cookie = login.headers.get("set-cookie")?.split(";")[0] || "";
  try {
    const media = new Map<string, { url: string; alt: string }>();
    for (const sample of samples) {
      const title = `Design sample: ${sample.image}`;
      const existing = await db.media.findFirst({
        where: { title },
        select: { url: true, alt: true },
      });
      if (existing) {
        media.set(sample.image, existing);
        continue;
      }
      const form = new FormData();
      form.set(
        "file",
        new Blob(
          [
            new Uint8Array(
              await readFile(`public/images/${sample.image}.webp`),
            ),
          ],
          { type: "image/webp" },
        ),
        `${sample.image}.webp`,
      );
      form.set("alt", sample.alt);
      form.set("title", title);
      form.set(
        "caption",
        "AI-generated illustration. Replace with your own image in Media Library.",
      );
      const uploaded = await (await call("/api/admin/media/", form)).json();
      media.set(sample.image, { url: uploaded.url, alt: sample.alt });
    }
    for (const sample of samples) {
      const slug = `blog/${sample.slug}`;
      if (
        await db.content.findUnique({ where: { slug }, select: { id: true } })
      )
        continue;
      await call("/api/admin/content/", {
        kind: "BLOG",
        slug,
        title: sample.title,
        excerpt: sample.excerpt,
        body: "",
        status: "PUBLISHED",
        publishedAt: new Date().toISOString(),
        sortOrder: 100,
        featuredImage: media.get(sample.image)!.url,
        imageAlt: sample.alt,
        seo: {
          title: `${sample.title} | HashTurn`,
          description: sample.excerpt,
          canonical: `https://powerautomatedeveloper.com/${slug}/`,
          ogImage: media.get(sample.image)!.url,
          schemaEnabled: false,
        },
        data: {
          sampleContent: true,
          eyebrow: sample.category,
          categoryNames: [sample.category],
          sections: sample.sections,
          related: sample.related,
        },
      });
      console.log(`Added sample: ${slug}`);
    }
    const home = await db.content.findUnique({ where: { slug: "" } });
    if (home) {
      const data = home.data as Record<string, unknown>;
      await call("/api/admin/content/", {
        ...home,
        publishedAt: home.publishedAt?.toISOString() || null,
        featuredImage:
          home.featuredImage || media.get("automation-documents")!.url,
        imageAlt: home.imageAlt || media.get("automation-documents")!.alt,
        data: {
          ...data,
          gallery: data.gallery || [
            media.get("automation-documents"),
            media.get("connected-systems"),
            media.get("automation-strategy"),
          ],
        },
      });
      console.log("Homepage imagery is editable through CMS image fields.");
    }
  } finally {
    await call("/api/admin/auth/", undefined, "DELETE");
  }
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
