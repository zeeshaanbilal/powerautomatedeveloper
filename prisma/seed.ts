import { createPrismaClient } from "../lib/prisma-client";
import { PrismaClient, Prisma } from "@prisma/client";
import { seedContent, defaults, defaultNavigation } from "../lib/seed-content";
const db = createPrismaClient();
async function main() {
  for (const entry of seedContent) {
    const { id, updatedAt, ...value } = entry;
    await db.content.upsert({
      where: { slug: entry.slug },
      update: {},
      create: {
        ...value,
        seo: value.seo as Prisma.InputJsonValue,
        data: value.data as Prisma.InputJsonValue,
        publishedAt: value.publishedAt ? new Date(value.publishedAt) : null,
      },
    });
  }
  for (const entry of seedContent) {
    const row = await db.content.findUnique({ where: { slug: entry.slug } });
    if (!row) continue;
    const related = await db.content.findMany({
      where: { slug: { in: entry.data.related || [] } },
      select: { id: true },
    });
    if (related.length)
      await db.content.update({
        where: { id: row.id },
        data: { related: { connect: related } },
      });
  }
  await db.siteSettings.upsert({
    where: { id: "site" },
    update: {},
    create: { id: "site", value: defaults as unknown as Prisma.InputJsonValue },
  });
  if ((await db.navigationItem.count()) === 0)
    await db.navigationItem.createMany({
      data: defaultNavigation.map(({ id, ...n }) => n),
    });
  for (const name of [
    "Power Automate",
    "Power Automate Desktop",
    "Power Apps",
    "Dataverse",
    "SharePoint",
    "RPA",
    "AI Automation",
    "Business Automation",
    "Microsoft 365",
    "API Integrations",
    "n8n",
    "Automation Strategy",
  ])
    await db.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replaceAll(" ", "-") },
    });
  console.log(
    `Seeded ${seedContent.length} initial pages. Existing content was preserved.`,
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
