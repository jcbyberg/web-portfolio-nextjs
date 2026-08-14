# Review: feat/seo-and-oshawa-offer @ f03311104656

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: layout/robots/sitemap/Hero/Projects/oshawa + image assets

## Verdict

APPROVE

## Findings

No BLOCKER, HIGH, MEDIUM, or LOW defects found.

All six Round 2 fixes are effective:

1. `src/app/oshawa/offer-config.js:29-43` now records owner approval on 2026-08-14 for both the quote and screenshot, identifies the external permission register, and sets `BOURNE_QUOTE_APPROVED = true`. The comment and runtime flag are consistent.
2. `src/app/oshawa/OshawaLanding.jsx:140-153` emits the fallback CSS through `dangerouslySetInnerHTML`. The built HTML contains the literal selector `[style*="opacity:0"]`, not `&quot;`. Framer Motion emits matching inline `opacity:0` declarations; the fallback's `opacity:1!important` and `transform:none!important` override those non-important inline declarations when JavaScript is disabled.
3. `src/app/oshawa/OshawaLanding.jsx:119-127` initializes `expired` to `false` on the server and first client render, then compares the fixed ISO instant in an effect, so it does not introduce a hydration mismatch or freeze expiry at build time. `2026-09-01T03:59:59Z` is August 31, 2026 at 11:59:59 p.m. EDT in Toronto. After that instant, the availability line is replaced by the promotion-closed message.
4. The built homepage has exactly two high-priority image preloads: the retained above-fold navbar logo and the intended hero portrait. About and Footer no longer use `priority`.
5. `src/app/components/ProjectCard.jsx:21-38` gives both icon-only source and preview links project-specific accessible names.
6. `src/app/components/ProjectCard.jsx:48` renders each project title as `h3`, correctly following the Projects section's `h2`.

No regression was found in the original review scope. Next.js is 13.4.15, and its installed metadata resolver/type declarations support `metadataBase`, relative `alternates.canonical`, `robots.googleBot`, `title: { default, template }`, and the default-exported robots/sitemap route shapes. The production output contains the expected title/canonical/robots/Open Graph/Twitter metadata and generates both metadata routes. Disallowing `/api/` is harmless for the POST-only `/api/send` route and is not treated as an access-control mechanism. The hardcoded Person JSON-LD uses schema.org Person properties and has no attacker-controlled value, so the `JSON.stringify` injection creates no XSS vector here.

Every project image reference exists: `bourne-to-climb.jpg`, `guitar-vault.jpg`, `1.jpg`, `2.jpg`, and `3.png`. Project IDs `0,1,2,3,4` are unique. Oshawa imports are used, reveal targets have a no-JS fallback, heading order and image alternatives are sound, and the requested contrast pairs pass WCAG AA/AAA for normal text: `#ADB7BE` on `#121212` is 9.18:1 and Tailwind cyan-300 (`#67E8F9`) on `#181818` is 12.25:1.

## Checks performed

- Read the supplied 1,587,541-byte `staged6.diff`, the staged Git diff, and the current files in scope.
- Confirmed the installed Next.js version is 13.4.15 and inspected its metadata resolver/type declarations for the reviewed keys and metadata-route shapes.
- `npm run lint` — passed: no ESLint warnings or errors.
- `npm run build` — passed: compilation, lint/type validation, page-data collection, and static generation completed; `/`, `/oshawa`, `/robots.txt`, and `/sitemap.xml` were emitted. Non-failing warnings were outdated Browserslist data and legacy Tailwind color aliases.
- Inspected `.next/server/app/index.html` and `oshawa.html`: metadata and JSON-LD are present; the Oshawa title uses the root title template; there are 14 matching Framer Motion `opacity:0` inline styles; the no-JS selector is unescaped; and the homepage contains only the logo and hero image preloads.
- Inspected generated `robots.txt.body` and `sitemap.xml.body`; both contain the expected production URLs, and the sitemap contains both `/` and `/oshawa`.
- Listed `public/images/projects/`: `1.jpg`, `2.jpg`, `3.png`, `4.png`, `5.png`, `6.png`, `bourne-to-climb.jpg`, and `guitar-vault.jpg`. Matched all five project references to real files and confirmed IDs 0–4 are unique.
- Evaluated the expiry timestamp around its boundary and formatted it in `America/Toronto`; the effect changes state only after 11:59:59 p.m. EDT on August 31.
- Searched app code for all `priority`, image, link-label, and heading usages relevant to the findings; calculated the requested contrast ratios.
- `git diff --staged --check` and `git diff --check` — passed with no whitespace errors.

Not verified: Vercel deployment, external URLs, live schema-validator results, or interactive/screenshot browser rendering. The production artifacts were inspected directly, but no browser-based visual run was performed.
