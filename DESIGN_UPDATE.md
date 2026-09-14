# Design update

The public website now uses Power Automate blues, a compact sticky header with 16px navigation, an image-led hero, image capability cards and blog cards. Calendly consultation links remain configured in Site Settings.

## Replace the images and articles

Developer portraits now appear in dedicated cards on `/developers/`, `/developers/our-team/` and hiring pages. In **Admin → Developers** or **Admin → Team**, set the featured image to the member's real portrait, add alt text, role and skills, and publish the profile. A 5:6 portrait crop works well; keep the face near the upper center. Missing photos show a labeled silhouette. Published team members populate the cards automatically; drafts remain hidden. The site wordmark, favicon and sharing image now use the uppercase HASHTURN identity and blue palette.

- **Admin → Pages → homepage:** Featured image controls the hero illustration. The first three gallery images control the three capability cards. Each image has an editable alt text field.
- **Admin → Media Library:** Upload your own image, copy its URL, then paste it into the relevant featured image or gallery field. The three generated illustrations have titles beginning with `Design sample:`.
- **Admin → Developers → Zeeshan Bilal:** Add a real featured image and alt text to replace the homepage founder monogram with your photograph.
- **Admin → Blog:** Three sample articles are published for visual review. Edit their titles, excerpts, featured images, content, category and SEO fields. Turn off **Sample content** when the replacement is reviewed. Sample articles and collections containing only samples are noindex and excluded from the sitemap.
- **Admin → Navigation:** Navigation labels, destinations and order remain editable.

Generated source assets are bundled as optimized WebP files:

- `public/images/automation-documents.webp`
- `public/images/connected-systems.webp`
- `public/images/automation-strategy.webp`

Copies were also uploaded through the existing media API, so the CMS controls the displayed versions. The local assets remain fallback artwork.

The official Microsoft Power Automate icon in `public/images/power-automate.svg` appears as a labeled product in the hero workflow diagram. Source and usage guidance: https://learn.microsoft.com/en-us/power-platform/guidance/icons . HashTurn remains the site's own brand.

## Contact form

The form already saves enquiries in the configured database. View submissions under **Admin → Contact Leads**. Validation, a honeypot, signed single-use challenges and rate limits are implemented. Email notifications are not implemented yet.

To connect email notifications, provide:

1. The destination inbox (confirm whether to use `hashturns@gmail.com`).
2. The sending email address and domain you control.
3. Your email provider details: SMTP host/port and credentials, or an email service API key. Put secrets in the local environment configuration, never in a chat message or public admin setting.

The sending domain may need provider verification in DNS. Once a provider is chosen, notification delivery and its environment variables can be implemented. The deployed website also needs the existing database, authentication secret and media configuration; the current changes are local, not deployed to the production domain.

## Artwork generation

Generated using the built-in image generation tool. No stock people, client logos or invented project screenshots are used. Prompt set:

1. **Document automation:** Use case: stylized-concept. Create a premium editorial 3D illustration for a Microsoft Power Automate consulting website. Landscape 1536x1024. Sculptural interconnected folded ribbons in cobalt blue, pale ice blue and polished white, threading through three floating translucent glass document panels and a subtle silver connector ring. Precise engineered forms, refined matte and glossy materials, soft studio shadows on a pale ice-white backdrop. Strong central composition with generous breathing room, no text, no letters, no logos, no people, no watermark. This is abstract business workflow automation, art directed like premium enterprise software imagery, restrained and sophisticated, not a busy sci-fi scene. Save the generated asset for use in the website.
2. **Connected systems:** Use case: stylized-concept. Asset type: premium enterprise automation blog cover, landscape 1536x1024. A sculptural arrangement of two interlocking cobalt blue and frosted glass loops with small white architectural cubes, suggesting API connections. Deep midnight blue studio backdrop, elegant directional light, tactile material, crisp precision edges, rich blue highlights, editorial product photography treatment, generous negative space. No text, logos, people, watermarks, UI or labels. A sophisticated restrained abstract illustration for HashTurn's Power Automate website.
3. **Automation strategy:** Use case: stylized-concept. Premium editorial 3D illustration for an automation strategy blog cover. Landscape 1536x1024. A stepped arrangement of translucent ice-blue glass blocks and matte cobalt blue rectangular blocks forming an elegant ascending architectural structure, with one brushed aluminum sphere balanced on a lower step. Pale lavender-white studio backdrop, soft realistic shadows, high-end material details, minimal sculptural composition. Conveys a well-planned process and careful construction. No text, no logos, no people, no watermark. Match sophisticated enterprise software brand art direction.
