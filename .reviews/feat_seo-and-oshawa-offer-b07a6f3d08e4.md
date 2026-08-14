# Review: feat/seo-and-oshawa-offer @ b07a6f3d08e4

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: layout/robots/sitemap/Hero/Projects/oshawa + image assets

## Verdict

REQUEST CHANGES

## Findings

1. **HIGH — `src/app/oshawa/offer-config.js:34`: the page publishes a testimonial and client screenshot even though its own provenance says the required written permission is still outstanding.** `BOURNE_QUOTE_APPROVED` is `true`, which takes the rendering branches at `OshawaLanding.jsx:289` and `:308`; however, lines 25–33 explicitly say the underlying permission remains verbal and that the screenshot and quote must stay off the page until a written artifact closes tier 3. The referenced `data/permissions/bourne-to-climb.md` is not present in this repository either. A production deployment therefore publicly attributes words to a named client and republishes his site screenshot without the approval state the code says is required. Set the flag to `false` until the written artifact exists and is recorded, or correct the provenance/record if permission has actually been obtained.

2. **MEDIUM — `src/app/oshawa/OshawaLanding.jsx:118–122`: the no-JavaScript fallback emits invalid CSS, leaving every reveal-animated block invisible.** The production HTML contains `<style>[style*=&quot;opacity:0&quot;] ...</style>` and the motion targets contain inline `opacity:0`. A `style` element is raw text, so `&quot;` is not decoded into a quote; the attribute selector is invalid and cannot override those inline styles. With scripting disabled, the hero, package, proof, process, and qualification content remain transparent. Use an unquoted selector such as `[style*=opacity]`, inject the style text without entity escaping, or use a stable reveal class with fallback CSS in the global stylesheet.

3. **MEDIUM — `src/app/oshawa/offer-config.js:17`: the offer never expires in application behavior.** `OFFER_END_DATE` is an opaque display string, and `OshawaLanding.jsx:166–190` only checks whether it is truthy; it never parses or compares a deadline. On September 1, 2026 and later, the page will still advertise “Available on work booked by August 31, 2026” and render the active “Claim a spot” CTA. Represent the deadline as an unambiguous timestamp/date in the business timezone and derive an expired state that removes or replaces the availability claim and claim CTA.

4. **MEDIUM — `src/app/components/HeroSection.jsx:71`: the LCP image becomes one of several priority images, so the change does not provide a clean LCP preload signal.** The generated homepage contains three high-priority image preloads: the navbar logo, hero portrait, and below-the-fold About portrait. On a cold/mobile load, the noncritical About fetch can compete with the 433 KB source hero portrait and delay the intended LCP fetch. Keep `priority` on the actual hero LCP image, remove it from `AboutSection.jsx:150` and `Footer.jsx:16`, and assess whether the small above-fold navbar logo needs it.

5. **MEDIUM — `src/app/components/ProjectsSection.jsx:107–114`: the two new cards expose icon-only links with no accessible names.** `ProjectCard.jsx:21–34` renders links containing only Heroicons, whose SVGs are `aria-hidden`; neither link has an `aria-label` nor visually hidden text. A screen-reader user reaches unnamed “link” controls and cannot distinguish source from preview or know which project they open. Pass the project title into descriptive labels such as “View Bourne To Climb live site” and “View Guitar Vault source code.”

6. **LOW — `src/app/components/ProjectCard.jsx:39`: project titles are `<h5>` elements directly under the Projects section `<h2>`.** The staged data adds two more cards to this skipped heading level, so assistive-technology heading navigation jumps from level 2 to level 5 for every project. Render project titles as `<h3>`.

No BLOCKER findings.

Metadata/routes/JSON-LD: no defect found. Against the installed Next.js 13.4.15 implementation and type declarations, `metadataBase`, relative `alternates.canonical`, `robots.googleBot`, `{ default, template }` titles, and the default-exported robots/sitemap metadata-route shapes are supported. The generated output confirms the canonical, title template, robots/googlebot tags, robots.txt, and sitemap.xml. Disallowing `/api/` is harmless but not a security control; crawlers do not submit the POST-only `/api/send` operation. The hardcoded Person JSON-LD uses valid schema.org properties and has no attacker-controlled XSS input.

Project assets/keys: no defect found. All five `image` paths in `ProjectsSection.jsx` exist under `public/images/projects/` (`bourne-to-climb.jpg`, `guitar-vault.jpg`, `1.jpg`, `2.jpg`, and `3.png`), and IDs 0–4 are unique. The hero correctly has static name text, a descriptive alt, and `priority`; the problem is the competing priority images above.

Oshawa static review: imports are used; `CONTACT_PHONE` is an unused exported configuration value but does not affect runtime. The `whileInView` targets otherwise have reachable viewport intersections. Oshawa heading order and image alt text are sound. The requested color pairs pass WCAG contrast: #ADB7BE is 9.18:1 on #121212 and 8.70:1 on #181818; Tailwind cyan-300 (#67E8F9) is 12.25:1 on #181818.

## Checks performed

- Read the supplied staged diff and all current files in scope.
- Confirmed `next` and `eslint-config-next` are 13.4.15 in package.json.
- Checked the installed 13.4.15 metadata resolver/type declarations for exact keys and export shapes.
- Listed `public/images/projects/`: `1.jpg`, `2.jpg`, `3.png`, `4.png`, `5.png`, `6.png`, `bourne-to-climb.jpg`, and `guitar-vault.jpg`; matched every project `image` value to a file and confirmed IDs 0–4 are unique.
- Searched all app components for `priority` and `loading`; inspected the generated homepage and found three distinct high-priority image preloads.
- Traced every Oshawa configuration/rendering branch and checked referenced permission paths.
- Calculated WCAG contrast ratios for the requested color pairs and reviewed headings, alt text, and link names.
- `npm run lint` — passed with no warnings or errors.
- `npm run build` — passed. It generated static `/`, `/oshawa`, `/robots.txt`, and `/sitemap.xml`; warnings were limited to outdated Browserslist data and renamed Tailwind color aliases.
- Inspected `.next/server/app/index.html`, `oshawa.html`, `robots.txt.body`, and `sitemap.xml.body` to verify emitted metadata, routes, JSON-LD, offer/permission branches, priority preloads, and no-JS styles.
- Attempted a no-JavaScript Playwright run using the local production server, but Chromium could not launch because the Windows sandbox denied Playwright subprocess creation (`WinError 5`). No interactive or screenshot-based browser verification was completed.

Not verified: deployment on Vercel, external URLs, live schema validation, or an actual browser rendering due to the sandbox limitation above.
