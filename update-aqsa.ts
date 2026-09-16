import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

async function main() {
  const aqsa = await db.content.findUnique({ where: { slug: 'developers/aqsa-wazeer' } });
  if (aqsa) {
    const data = aqsa.data as Record<string, any>;
    data.role = "RPA Developer";
    
    await db.content.update({
      where: { slug: 'developers/aqsa-wazeer' },
      data: {
        excerpt: "RPA Developer at HashTurn. Aqsa builds attended and unattended workflows for legacy application automation.",
        data
      }
    });
  }

  console.log("Updated Aqsa successfully!");
}

main().catch(console.error).finally(() => db.$disconnect());
