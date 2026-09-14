# HashTurn automation website

A Next.js App Router website for **HashTurn LLC** at `https://powerautomatedeveloper.com`, with TypeScript, PostgreSQL/Prisma, server-rendered public content and a protected CMS. Built from an empty workspace using the supplied requirements. No client claims, testimonials, certifications or case-study results have been invented.

## Local setup

Requires Node.js 20.9+ (Node 24 used for development), npm and PostgreSQL.

```powershell
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL` to your pooled PostgreSQL connection, `DATABASE_URL_UNPOOLED` to the direct connection used for migrations, and `AUTH_SECRET` to at least 32 random characters. Do not commit `.env`. Prisma CLI and Next.js read it automatically; the seed/admin scripts load it explicitly.

```powershell
npm run db:generate
npm run db:migrate
node --env-file=.env --import tsx prisma/seed.ts
node --env-file=.env --import tsx scripts/create-admin.ts
npm run dev
```

The administrator command prompts for a password without displaying it. There is no public registration or default password. Sign in at `/admin/login/`. The first seed preserves existing content. Run it once during initial provisioning; do not use it to reset production edits.

Without `DATABASE_URL`, public routes show initial content for local preview and the admin/contact form report that they are not configured. Once a database URL exists, database errors fail visibly rather than replacing production content with seed data. **Do not launch with the preview fallback.**

## Architecture and content

- Next.js 16 App Router, React, TypeScript, CSS with system fonts, responsive layouts and server components.
- PostgreSQL with Prisma. `Content` implements Page, Service, HirePage, Industry, Developer, TeamMember, CaseStudy, BlogPost, Guide, FAQ and Testimonial using a validated `kind`, shared publishing fields and typed business data. This deliberately uses one consistent publishing engine rather than separate tables with duplicated logic.
- Normalised Users, Sessions, Categories, Tags, related Content, Media, Redirects, NavigationItems, Leads, SiteSettings, GrowthOpportunities and RateLimits. SEOSettings are stored with each record and defaults in SiteSettings.
- Published records with a future publication date remain private until that time; no external scheduler is needed. Publication eligibility is evaluated per request. Content/settings/navigation use a five-minute server cache, immediately invalidated by CMS mutations. Deploy multiple instances with a shared Next.js cache handler if you need synchronous invalidation across every instance.
- Public pages use one catch-all template for clean CMS paths, plus an editorial homepage. Services, hiring options, industry pages, founder/team, about, pricing and resource collections are seeded. Blog posts, case studies and team-member records can be added in admin.
- Categories, tags, authors, FAQs, media, related content, SEO fields and publication dates are editable. The article editor supports headings, lists, emphasis and links. Pasted text is inserted as plain text and all HTML is sanitized on save and output.
- Legal pages are editable review structures and intentionally noindex until a qualified reviewer finalises the applicable policies. Empty resource collections are navigable, with no fabricated articles.

## Admin

`/admin/` provides content CRUD, drafts, scheduling, ordering, authenticated previews, SEO warnings, media uploads with WebP optimisation, taxonomy management, navigation, redirects, site/SEO/analytics settings, lead status/notes/deletion, an SEO audit and an earned-backlink tracker. No outreach is sent automatically.

Images are restricted to decoded JPEG/PNG/WebP input, at most 8 MB / 40 megapixels, resized to at most 2400 × 2400 and re-encoded as WebP with metadata removed. When `AWS_ENDPOINT_URL_S3` is configured, files go to the Neon `uploads` bucket using branch-scoped S3 credentials. Otherwise `MEDIA_DIR` provides a local persistent-disk fallback. The `/uploads/` route serves immutable image responses and works with Next.js image optimisation. Referenced images cannot be deleted through the library.

## Security

- bcrypt password hashing; random database sessions stored as SHA-256 digests; 8-hour HttpOnly, SameSite cookies; Secure cookies in production.
- Authorization on every admin page group and mutation endpoint. Authenticated draft previews remain under `/admin/` with noindex.
- Same-origin checks on mutations, validated payloads, sanitized HTML, security headers, request limits for image/contact payloads and database-backed rate limits.
- Login limits by email and IP; contact limits by email and IP, signed short-lived form challenge, honeypot and replay protection.
- Set `TRUST_PROXY=true` only if the reverse proxy overwrites `X-Forwarded-For`. Otherwise rate limits use a shared bucket. Configure proxy body limits and per-IP request limits as defence in depth.
- No secrets in browser code. Analytics only loads after opt-in; conversion events do not contain form values. Administrators can remove enquiries for retention/privacy requests.
- Run scheduled maintenance to delete expired `RateLimit` and `Session` rows. Deploy behind a trusted reverse proxy and restrict database network access.

## SEO and validation

Metadata is generated centrally: unique titles/descriptions, one HTTPS canonical, OG/Twitter images, accurate Organization/WebSite/WebPage/Service/Person/Article/FAQ/Breadcrumb JSON-LD. No ratings or invented claims. Public sitemap excludes drafts, future publications, noindex records, private types and alternative canonicals; uses real update timestamps and no fake priorities. Robots blocks admin and API routes.

```powershell
npm run typecheck
npm test
npm run build
npm start
# In another terminal, with the server running:
npm run audit
```

Set `AUDIT_URL` to audit another local/staging origin. The audit crawls public links and checks HTTP responses, titles/descriptions, canonicals, H1s, schema JSON, OG fields, local images, anchors, sitemap, robots, 404s and unauthenticated admin access. Results are written to `artifacts/seo-audit.json`. The admin SEO audit checks CMS records; it is not a substitute for a rendered crawl or production Search Console.

## Production deployment

1. Provision PostgreSQL, configure backups and a least-privilege application account. Apply migrations, seed initial content and create the first administrator.
2. Deploy the Next.js application to a compatible Node.js host such as Vercel or a managed Node server. Neon hosts the database, uploads bucket and separately requested hello function. It does not host this Next.js frontend.
3. Set the pooled/direct database variables, `AUTH_SECRET`, the Neon `AWS_*` storage variables, `MEDIA_BUCKET=uploads`, `ENFORCE_CANONICAL=true` and the correct trusted-proxy setting. Keep the production hostname fixed to `powerautomatedeveloper.com`. If storage variables are absent, a persistent volume is required for the local media fallback.
4. Configure DNS/TLS and edge redirects for HTTP and `www` directly to the canonical HTTPS host. Configure the proxy to overwrite forwarding headers. Test there is no redirect loop or mixed content; HSTS is emitted when canonical enforcement is enabled.
5. Add real business contact details, approved logo/photos, navigation and reviewed content through admin. Finalise privacy/terms/cookie documents with the appropriate adviser and remove noindex only after approval. No legal compliance is claimed by the starter policy copy.
6. Verify a complete authenticated CMS lifecycle, uploads after restart, scheduling, redirects and a real enquiry stored in the production database. Leads are available in admin; automated email delivery is not configured.
7. Add the Search Console verification token and (optionally) a GA4 measurement ID through settings. Verify domain ownership and submit `/sitemap.xml` in Search Console. Those external account actions are not performed by the code.
8. Run the runtime audit against staging. Review keyboard navigation, screen-reader behaviour and all requested mobile widths. Measure Lighthouse/lab performance and production Core Web Vitals; no field scores or ranking guarantees are claimed.
9. Set monitoring, uptime/error alerts, database/media backups and a restore test. Schedule expired-session/rate-limit cleanup. Keep dependencies patched.

## Neon project configured in this session

- Project: `steep-forest-82797072`; branch: `production` (`br-royal-field-ayjrja6g`), AWS us-east-2.
- Neon CLI installed and authenticated; project skills installed; Codex MCP installed with a project-scoped key. Restart Codex if the new MCP tools are not visible yet.
- `neon.ts` declares the public-read `uploads` bucket and `api` hello function. AI Gateway remains disabled.
- Deployed function: https://br-royal-field-ayjrja6g-api.compute.c-5.us-east-2.aws.neon.tech/ — verified response: `Hello from Neon Functions`.
- Initial PostgreSQL migration applied; 40 initial pages seeded; administrator `hashturns@gmail.com` created. The generated password is in the ignored `.admin-credentials.txt` file. Move it to your password manager and keep the file private.
- `.env` contains generated/pulled credentials. `.env`, `.neon` and the admin credential file are ignored. Never include them in a deployment archive; enter their values through the host’s secret/environment settings.

Run `neon config plan` before subsequent infrastructure changes and `neon deploy` to apply the declared backend configuration. The website’s domain, hosting, DNS and Search Console setup remain external steps.
