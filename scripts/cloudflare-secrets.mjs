import { readFileSync, writeFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { spawnSync } from "node:child_process";

const source = parseEnv(readFileSync(".env", "utf8"));
const keys = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AWS_ENDPOINT_URL_S3",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
];
const secrets = {};
for (const key of keys) {
  if (!source[key]) throw Error(`Missing ${key} in local .env`);
  secrets[key] = source[key];
}
if (process.argv.includes("--local")) {
  writeFileSync(
    ".dev.vars",
    Object.entries(secrets)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join("\n") + "\n",
  );
  console.log(
    "Created ignored .dev.vars for local Workers preview; no secrets printed.",
  );
} else if (process.argv.includes("--upload")) {
  const result = spawnSync(
    process.execPath,
    ["node_modules/wrangler/bin/wrangler.js", "secret", "bulk"],
    {
      input: JSON.stringify(secrets),
      stdio: ["pipe", "inherit", "inherit"],
    },
  );
  process.exit(result.status ?? 1);
} else {
  console.log(
    "Use --local for local preview or --upload to store only the required runtime secrets in Cloudflare.",
  );
}
