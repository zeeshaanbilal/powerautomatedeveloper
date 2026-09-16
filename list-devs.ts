import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

async function main() {
  const devs = await db.content.findMany({ where: { kind: "TEAM" }, select: { title: true, slug: true, sortOrder: true } });
  console.log("Developers:", devs);
}

main().catch(console.error).finally(() => db.$disconnect());
