import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
const db = new PrismaClient();
async function hiddenPassword(): Promise<string> {
  if (!stdin.isTTY) throw Error("Run this command in an interactive terminal.");
  stdout.write("Password (12–72 characters, hidden): ");
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const handler = (data: Buffer) => {
      for (const char of data.toString()) {
        if (char === "\u0003") {
          cleanup();
          reject(Error("Cancelled"));
          return;
        }
        if (char === "\r" || char === "\n") {
          cleanup();
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (char >= " ") value += char;
      }
    };
    function cleanup() {
      stdin.off("data", handler);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
    }
    stdin.on("data", handler);
  });
}
async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const email = (await rl.question("Administrator email: "))
    .trim()
    .toLowerCase();
  const name = (await rl.question("Administrator name: ")).trim();
  rl.close();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name)
    throw Error("Enter a valid email and name.");
  const password = await hiddenPassword();
  if (password.length < 12 || Buffer.byteLength(password) > 72)
    throw Error(
      "Password must contain at least 12 characters and at most 72 bytes.",
    );
  if (await db.user.findUnique({ where: { email } }))
    throw Error(
      "An administrator with this email already exists. No changes made.",
    );
  await db.user.create({
    data: {
      email,
      name,
      passwordHash: await hash(password, 12),
      role: "ADMIN",
    },
  });
  console.log("Administrator created.");
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
