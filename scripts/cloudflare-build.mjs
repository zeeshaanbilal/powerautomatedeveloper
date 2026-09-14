import { spawnSync } from "node:child_process";
import { writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
const result = spawnSync(
  process.execPath,
  ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"],
  {
    stdio: "inherit",
    env: { ...process.env, CLOUDFLARE_BUILD: "true" },
  },
);
if (result.status === 0) {
  // OpenNext otherwise embeds local .env values into its server environment
  // fallback. Runtime credentials must come exclusively from Worker secrets.
  writeFileSync(
    ".open-next/cloudflare/next-env.mjs",
    "export const production = {};\nexport const development = {};\nexport const test = {};\n",
  );
  function removeCopiedEnv(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) removeCopiedEnv(file);
      else if (entry.name === ".env" || entry.name.startsWith(".env."))
        unlinkSync(file);
    }
  }
  removeCopiedEnv(".open-next");
}
process.exit(result.status ?? 1);
