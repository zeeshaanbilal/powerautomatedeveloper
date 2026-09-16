import { createPrismaClient } from "./lib/prisma-client";
const db = createPrismaClient();

db.content.findUnique({where: {slug: 'developers/maaz-ahmad'}})
  .then(m => console.log(m?.featuredImage))
  .finally(() => db.$disconnect());
