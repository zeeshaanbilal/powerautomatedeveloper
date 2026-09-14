# HashTurn implementation plan

Inspection: the supplied workspace is empty, with no Git repository, existing framework, database, components, authentication, or deployment configuration. The shared ChatGPT URL could not be fetched. The pasted specification is the source of requirements.

1. Foundation: Next.js App Router, TypeScript, npm, PostgreSQL/Prisma, reusable server-rendered content templates and a restrained navy/teal design.
2. Public site: editorial homepage, differentiated service/hire/industry content, founder/team pages, resources, contact and editable legal structures. No fabricated proof or automatically published articles.
3. CMS: typed content records with common publication/SEO fields, related content, taxonomies, media, navigation, settings, leads, redirects, and growth tracker. A shared content model avoids duplicating publishing logic across page types.
4. Admin: database sessions, password hashing, protected route handlers and pages, same-origin mutations, validation, database rate limits, publishing controls, rich text editing, authenticated previews and SEO warnings.
5. SEO: centralized metadata, schema, sitemap/robots, canonical redirects, audit dashboard and runtime crawl script.
6. Verification: typecheck, production build, security/content tests, public route crawl and responsive browser inspection when available. Record external setup and unverified production requirements honestly.

Initial dependencies covered the framework, Prisma, password hashing, schema validation, HTML sanitization and image processing. The requested Neon setup added its configuration packages and an S3 client for Neon media storage. PostgreSQL and the uploads bucket are now configured; the migration, content seed and first administrator are complete. The application still needs a production Next.js host. Database failures must not silently replace live content with seed content.

Implementation and verification results are recorded in IMPLEMENTATION_REPORT.md. The shared chat was unavailable, but the pasted website specification and subsequent Neon instructions were implemented.
