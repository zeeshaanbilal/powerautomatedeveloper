# Cloudflare Workers deployment

This is a full-stack Next.js application. Deploy to **Workers**, using the OpenNext adapter, rather than a static Pages upload. PostgreSQL and existing uploaded media remain in Neon.

## Commands

Use Node.js 24. Install with `npm ci`, then:

```sh
npm run cf:build
node scripts/cloudflare-secrets.mjs --local
npm run cf:preview
```

For an authenticated deployment:

```sh
npx wrangler login
node scripts/cloudflare-secrets.mjs --upload
npm run cf:deploy
```

The secret helper reads the existing local `.env` and transfers only DATABASE_URL, AUTH_SECRET, AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. It never prints their values. `.dev.vars` and build output are ignored by Git. Never upload `.env` to GitHub or paste secrets into build commands.

For Git-connected Workers builds, select this repository, use `npm run cf:build` as the build command and `npm run cf:deploy` as the deploy command. Configure the same runtime secrets in Worker settings. DATABASE_URL_UNPOOLED is only needed for local migrations; deployment does not run migrations or reseed production data.

## Runtime details

- JavaScript-only Prisma engine and Neon adapter; the Worker explicitly uses Prisma's WebAssembly entry point. Connections close on release to avoid reusing request-owned sockets.
- Cloudflare Images binding processes admin uploads and Next image transformations. Enable Images on the account if required; check its applicable usage charges before enabling a paid subscription.
- Local Node.js image processing continues to use Sharp. Cloudflare builds select the Images implementation through a server alias.
- Neon S3-compatible storage remains persistent; local filesystem uploads are not a production storage option on Workers.
- CMS pages are dynamic. Persistent incremental caching is disabled for this initial deployment, so edits are immediately visible across Workers. Static assets retain immutable caching. Database traffic may be higher than with a provisioned distributed cache.
- Cloudflare's connecting-IP header is used for rate limiting on Workers.
- The build strips OpenNext's embedded environment fallback; credentials are provided through Worker secrets.

## Domain

First verify the workers.dev deployment. Then connect `powerautomatedeveloper.com` and `www.powerautomatedeveloper.com` as Worker custom domains and enable ENFORCE_CANONICAL once DNS and TLS work. The canonical public URL stays `https://powerautomatedeveloper.com`.

Keep admin/API responses out of any custom Cloudflare cache-everything rules. Configure HTTPS redirection at the domain level. Verify sign-in, CMS saving, media upload, lead submission, sitemap and domain redirects after deployment.

Workers script-size limits and Images availability depend on the account plan. A successful local build does not confirm that an account's plan accepts the bundle. Do not activate a paid plan without the account owner's approval.

References: [OpenNext configuration](https://opennext.js.org/cloudflare/get-started), [Prisma runtime exports](https://opennext.js.org/cloudflare/howtos/workerd), [Cloudflare Images binding](https://developers.cloudflare.com/images/optimization/binding/).
