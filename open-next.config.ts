import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/** Call `next build` directly so `npm run build` can safely wrap OpenNext (no recursion). */
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npx next build",
};
