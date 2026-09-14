# Vercel deployment

Import `zeeshaanbilal/powerautomatedeveloper` as a Next.js project, with the repository root as Root Directory. `vercel.json` sets `npm ci` and `npm run build`. Select Node.js 24.x. Do not use the Cloudflare build command on Vercel.

The production branch is `main`. Connect the Git repository in Project Settings → Git to enable automatic deployments.

Configure these production environment variables in Vercel's project settings:

| Variable | Value source |
| --- | --- |
| DATABASE_URL | Existing pooled Neon connection in local `.env` |
| AUTH_SECRET | Existing local secret |
| AWS_ENDPOINT_URL_S3 | Existing Neon storage endpoint |
| AWS_ACCESS_KEY_ID | Existing storage access key |
| AWS_SECRET_ACCESS_KEY | Existing storage secret key |
| AWS_REGION | `us-east-2` |
| MEDIA_BUCKET | `uploads` |
| SITE_URL | `https://powerautomatedeveloper.com` |
| TRUST_PROXY | `true` |
| ENFORCE_CANONICAL | `false` until the custom domain works |

Leave CLOUDFLARE_BUILD and CLOUDFLARE_WORKER unset. Database credentials and media remain in Neon; this deployment does not run migrations or seed production content. DATABASE_URL_UNPOOLED is needed only when running Prisma CLI migrations separately.

Do not put secrets in this document, GitHub, or `vercel.json`. `.vercelignore` excludes local credentials and build artifacts from CLI uploads. Use a separate Neon branch and separate authentication secret for preview deployments if they need CMS access; do not automatically share production secrets with every preview branch.

Verify the Vercel URL first, including admin login, an upload, and the contact form. Then add the custom domain in Vercel and configure the exact DNS records Vercel provides in Cloudflare. Enable canonical redirects only after DNS and TLS work. Existing Cloudflare Workers deployment is separate and does not need to be deleted to prepare Vercel.
