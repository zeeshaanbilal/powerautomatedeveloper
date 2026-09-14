import { createPrismaClient } from "../lib/prisma-client";
import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { writeFile } from "node:fs/promises";
const db = createPrismaClient();
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Error("Pass the administrator email as the only argument.");
  if (await db.user.findUnique({ where: { email } })) {
    console.log("Administrator already exists; password preserved.");
    return;
  }
  const password = randomBytes(24).toString("base64url");
  await writeFile(
    ".admin-credentials.txt",
    `HashTurn administrator\nEmail: ${email}\nPassword: ${password}\nSign in: http://localhost:3000/admin/login/\nKeep this file private and transfer the password to your password manager.\n`,
    { flag: "wx", mode: 0o600 },
  );
  await db.user.create({
    data: {
      email,
      name: "HashTurn Administrator",
      passwordHash: await hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log(
    "Administrator created. Password saved to ignored .admin-credentials.txt; no password printed.",
  );
}
main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
