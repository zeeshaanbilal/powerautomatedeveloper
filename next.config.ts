import type { NextConfig } from "next";
import path from "node:path";
const config: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: {},
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  webpack(config, { webpack }) {
    if (process.env.CLOUDFLARE_BUILD === "true") {
      config.resolve.alias["@/lib/optimize-image"] = path.resolve(
        "lib/optimize-image.cloudflare.ts",
      );
      config.resolve.alias["@/lib/prisma-client"] = path.resolve(
        "lib/prisma-client.cloudflare.ts",
      );
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /(?:^|\/)optimize-image$/,
          path.resolve("lib/optimize-image.cloudflare.ts"),
        ),
        new webpack.NormalModuleReplacementPlugin(
          /(?:^|\/)prisma-client$/,
          path.resolve("lib/prisma-client.cloudflare.ts"),
        ),
      );
    }
    return config;
  },
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
          },
          ...(process.env.ENFORCE_CANONICAL === "true"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};
export default config;
