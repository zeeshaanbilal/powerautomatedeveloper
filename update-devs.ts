import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

async function main() {
  // Update Maaz to sortOrder 2
  await db.content.update({
    where: { slug: 'developers/maaz-ahmad' },
    data: { sortOrder: 2 }
  });

  // Update Zohaib to sortOrder 3 and change role
  const zohaib = await db.content.findUnique({ where: { slug: 'developers/zohaib-rashid' } });
  if (zohaib) {
    const data = zohaib.data as Record<string, any>;
    data.role = "Automation Engineer";
    
    await db.content.update({
      where: { slug: 'developers/zohaib-rashid' },
      data: {
        sortOrder: 3,
        excerpt: "Automation Engineer at HashTurn. Zohaib specialises in business automation.",
        data
      }
    });
  }

  // Update Aqsa to sortOrder 4
  await db.content.update({
    where: { slug: 'developers/aqsa-wazeer' },
    data: { sortOrder: 4 }
  });

  console.log("Updated database successfully!");
}

main().catch(console.error).finally(() => db.$disconnect());
