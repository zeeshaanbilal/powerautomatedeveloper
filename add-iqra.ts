import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

async function main() {
  await db.content.create({
    data: {
      id: "iqra-ahsan",
      kind: "TEAM",
      slug: "developers/iqra-ahsan",
      title: "Iqra Ahsan",
      excerpt: "SharePoint Architect at HashTurn. Iqra designs robust and scalable SharePoint architectures.",
      status: "PUBLISHED",
      sortOrder: 5,
      seo: {
        title: "Iqra Ahsan | SharePoint Architect",
        description: "Iqra Ahsan is a SharePoint Architect at HashTurn.",
        canonical: "",
        schemaEnabled: true,
      },
      data: {
        role: "SharePoint Architect",
        sections: [
          {
            title: "SharePoint Architecture",
            text: "Iqra plans the information architecture, governance policies, and designs robust SharePoint solutions.",
          },
        ],
        skills: ["SharePoint", "Microsoft 365", "Architecture"],
        related: ["services/sharepoint-automation"],
      },
      body: "",
      featuredImage: "",
      imageAlt: "Iqra Ahsan, SharePoint Architect",
      publishedAt: new Date()
    }
  });

  console.log("Added Iqra Ahsan successfully!");
}

main().catch(console.error).finally(() => db.$disconnect());
