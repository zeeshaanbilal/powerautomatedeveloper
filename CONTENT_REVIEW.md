# Website copy ready for review

Full copy has been added to 13 existing pages: Privacy Policy, Terms of Use, Cookie Policy, Services, Hire, Industries, Developers, Blog, Resources, Automation Guides, Power Automate Guides, Business Automation Guides and Case Studies. Edit these under **Admin → Pages**. The existing service pages, individual hiring pages, About, Pricing and team introduction already had substantive copy and were retained.

The legal pages are complete drafting starting points tailored to the current application, not a certification of legal compliance. Their existing noindex setting is retained during review. No registered address, governing state, statutory response deadline, guaranteed deletion period or completed client result was invented.

## Confirm before public launch

- The legal entity's registered details and preferred privacy contact. The current draft directs requests to the existing Contact page.
- Countries in which the business operates, applicable privacy obligations and the governing-law/dispute approach a qualified legal reviewer recommends.
- The actual provider list, hosting locations, international-transfer arrangements and contractual safeguards. Neon is used for the database; Calendly is linked for booking; analytics is conditional on configuration and consent.
- A retention policy for enquiries, correspondence, client records and backups. The application currently has no automatic fixed-period deletion for contact leads; the draft says so.
- The Google Analytics property settings, including cookie durations and data retention, if analytics is enabled. These are not determined by the website code alone.
- Whether additional practices are introduced later, such as newsletters, advertising, customer accounts, new integrations or processing client data through this site. Update the notices to match them.

The draft cookie description was checked against `components/tracking.tsx` and `lib/auth.ts`: an eight-hour administrator session, a local-storage analytics preference, consent-gated Google Analytics, and a link to Calendly rather than an embedded widget.

Reference used for the privacy-notice structure: [ICO — Cookies and privacy notices in detail](https://ico.org.uk/for-organisations/advice-for-small-organisations/privacy-notices-and-cookies/cookies-and-privacy-notices-in-detail/). This is structural guidance, not a determination that UK law applies to HashTurn.

## Content boundaries

The case-study collection explains how to evaluate evidence and includes a clearly identified illustrative document-approval scenario. It does not claim that this is a completed client project. The three previously created blog samples remain labeled as samples. Guide landing pages now provide practical planning guidance; no unreviewed technical tutorial or invented customer proof was added.

Previous CMS values are saved in the ignored `artifacts/content-backups/` directory. The source copy is in `lib/page-copy-drafts.ts`, and fresh project seeds use the same copy. Subsequent edits in the admin panel remain authoritative. `scripts/apply-page-copy.ts` is a deliberate one-time replacement utility; rerunning it would replace the targeted pages' excerpts and sections again.
