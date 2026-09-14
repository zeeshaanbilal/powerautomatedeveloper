import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// CMS routes are dynamic. Without a persistent incremental cache, edits are
// immediately visible and do not require provisioning a separate cache bucket.
export default {
  ...defineCloudflareConfig({
    incrementalCache: "dummy",
    tagCache: "dummy",
    queue: "dummy",
  }),
  buildCommand: "npx prisma generate && npx next build --webpack",
};
