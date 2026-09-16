import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

async function main() {
  const zohaib = await db.content.findUnique({ where: { slug: "developers/zohaib-rashid" } });
  console.log("Zohaib data:", zohaib?.data);
}

main().catch(console.error).finally(() => db.$disconnect());
