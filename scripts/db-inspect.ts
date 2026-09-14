import { createPrismaClient } from "../lib/prisma-client";
const db = createPrismaClient();
async function main() {
  const tables = await db.$queryRaw<
    { table_name: string }[]
  >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log(
    JSON.stringify(
      { connected: true, publicTables: tables.map((t) => t.table_name) },
      null,
      2,
    ),
  );
}
main()
  .catch(() => {
    console.error("Database connection failed; no credentials were printed.");
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
