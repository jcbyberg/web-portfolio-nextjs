# ai.whitespacedesign.ca — design

**Date:** 2026-08-29
**Status:** approved, not yet implemented

## Purpose

A one-page marketing site for the AI-automation side of Whitespace Design. It is
intended to be the primary client-acquisition channel for that work, not a
portfolio addendum.

**Audience:** owner-operators of businesses with roughly 5–30 staff, local to
Durham Region and the wider Ontario market — the same buyers as the existing
client base.

**Pitch framing: capacity, not headcount.** The claim is that a team stops
spending its week on repetitive production work, not that the owner can cut
someone. This is a deliberate choice. The wage-cost math is what the buyer runs
privately, but the page is also read by the staff of the prospect, and most
small-business owners in this bracket are buying capacity rather than planning
layoffs. Same arithmetic, better conversion, and it does not date badly.

## Scope

One scrolling page. No case-study detail pages, no interactive demos, no auth,
no CMS. Contact is a link to the existing `/hire-me` route on the apex domain
rather than a new form.

Explicitly out of scope: anything that makes this a product surface. If it later
becomes one, that is a separate spec.

## Architecture

### Route

A new section under `src/app/ai/`, mirroring the shape of `src/app/whitespace/`:

```
src/app/ai/
├── layout.js          # metadata, JSON-LD, masthead/footer chrome
├── page.js            # the single scrolling page
├── ai.css             # all styling, scoped under .ai-root
└── sitemap.xml/
    └── route.js       # subdomain-scoped sitemap
```

### Worker

A new repository `D:\ai-domain-worker`, copied in shape from
`racedad-domain-worker`. It binds `ai.whitespacedesign.ca` as a Cloudflare custom
domain and rewrites `/` to `/ai` upstream, passing `/_next/`, `/images/`,
`/api/`, and `/favicon` through untouched. It serves its own `robots.txt` and
`sitemap.xml`.

**The existing `whitespace-design` worker is not modified.** That worker
canonicalises every request to the apex host, so teaching it a second identity
would mean reworking the redirect logic in which an open redirect was found and
fixed on 2026-08-29. A separate worker keeps that blast radius at zero and
matches the established one-worker-per-brand pattern.

### Data flow

```
visitor → ai.whitespacedesign.ca (Cloudflare Worker)
        → rewrite / → /ai
        → upstream Next app
        → response, with links rewritten to stay on the subdomain
```

## SEO

The same machinery as the whitespace brand domain, which is the explicit
requirement.

- `src/lib/seo.js` gains `AI_ORIGIN = 'https://ai.whitespacedesign.ca'` and an
  `aiUrl(slug)` helper, alongside the existing whitespace and racedad pair.
- Canonical URLs are built from the bare slug, never the on-site `/ai/…` path,
  because the worker strips the prefix. Passing a prefixed path would point the
  canonical at a URL the subdomain does not serve.
- `openGraph` is set explicitly at page level. Next.js **replaces** rather than
  merges a parent `openGraph` object; relying on inheritance is what caused 18
  pages to emit a wrong `og:url` in the previous SEO pass.
- Self-canonical. No cross-canonical to the apex — this is distinct content, not
  a duplicate of anything on `whitespacedesign.ca`.
- `organizationSchema` with `sameAs` listing `whitespacedesign.ca` and
  `joshbyberg.com`, so crawlers read the properties as one operator's.
- A `Service` JSON-LD block, which the whitespace section does not have and a
  services page should. This is what makes the page eligible for service-intent
  results.
- Own `robots.txt` and `sitemap.xml`, served by the worker.

### Known cost of the subdomain choice

Google treats a subdomain as a largely separate property. `ai.whitespacedesign.ca`
starts with close to no inherited authority, where `whitespacedesign.ca/ai` would
inherit the apex's. For a page whose job is lead generation, that means
measurably slower ranking in the first months.

This was raised and the subdomain was chosen anyway, for clean brand separation
and worker isolation. The `sameAs` schema above is the available mitigation. If
organic acquisition underperforms after a full quarter, moving the content to a
subfolder with 301s from the subdomain is the fallback, and should be treated as
a planned option rather than a failure.

## Visual design

The brief is "the opposite of Whitespace", and the inversion is literal rather
than decorative.

`whitespacedesign.ca` is built as a press sheet: uncoated white stock
(`#FCFCFA`), rich black ink, crop marks, CMYK registration magenta as the single
accent, serif body text. Ink on paper — subtractive colour, reflected light.

The AI section inverts every axis of that:

| Whitespace | AI |
|---|---|
| White stock ground | Black ground |
| Ink on paper (subtractive, CMYK) | Emitted light (additive, RGB) |
| Serif body | Mono-forward |
| Crop marks, trim, registration | No print furniture |

The inversion is also true of the businesses: one prints things, one runs
software. Structural bones are shared — masthead, `--gutter` and `--measure`
scale, the faint aurora wash — so the two read as the same hand.

All styling is scoped under `.ai-root`, following the `.ws-root` precedent. The
stylesheet is imported only by the AI section layout and must never emit a bare
rule, so nothing can leak into the apex site.

Contrast is a hard requirement, not a preference: every text colour is checked
against the black ground at 4.5:1, with any colour below that marked in the CSS
as decoration-only — the same discipline `whitespace.css` already applies to
`--ink-35` and `--reg`.

## Content

Hero, three sections, contact.

1. **Hero** — capacity claim, aimed at an owner. Contact button.
2. **Marketing that ships without a coordinator** — the Klaviyo email pipeline
   and the Meta posting/reel pipeline. Product pulls, campaign builds, cutting,
   captioning, scheduling, sponsor tagging.
3. **Finding the shot** — vidx. Hours of 4K footage reduced to a searchable
   1.3 KB index with transcripts, shot boundaries and OCR'd race numbers,
   offline on CPU. The strongest single number available, and the one most
   legible to anyone who has paid for video work.
4. **Custom** — built to an existing process, running on the client's own
   hardware, verifying its own output.
5. **Contact** — link to `/hire-me` on the apex domain.

**Clients are described, not named:** "a Whitby motorcycle dealer", "a racing
team". This avoids a permission conversation entirely while keeping the examples
concrete. Named references with logos would be stronger local proof and can be
added later, but only after asking each client.

ASAC (the Adobe Stock pipeline) is deliberately excluded. It is revenue
generation for the operator, not capacity returned to a client, and under a
capacity framing it dilutes the page.

## Testing and verification

1. Unit tests for the worker: path mapping, pass-through prefixes, and the
   redirect/normalisation behaviour, following the existing worker test suites
   (22 tests for racedad, 15 for whitespace).
2. Production build of the Next app, confirming the new route renders as a
   static page and the sitemap output is correct.
3. **Visual verification before any completion claim** — render the page and
   look at it at mobile and desktop widths. A green test suite is not evidence
   that a marketing page looks right.
4. Contrast check on every text colour against the black ground.
5. Cross-family review of the diff before commit, per the standing review rule.

## Deferred

- Case-study detail pages per automation
- Interactive or live demos
- Named clients and logos
- Any move of this content to a subfolder (see "Known cost" above)
