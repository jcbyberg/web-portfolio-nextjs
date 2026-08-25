# Three Blogs + "Bring Your Idea to Life" Landing — Design & Build Contract

Branch: `feat/blogs-and-landing`

## Goal

Bring three blogs into the Next.js portfolio as top-level brand sections, each keeping
its own visual identity, all funnelling traffic to one new conversion page.

## Decisions (locked — do not relitigate)

- **URL structure = option A**, brand sections at the root.
- **Nonprofit posts are CUT.** Do not port `the-20-hour-rule.md` or `whitespace-designs-post.md`.
- **Race Dad: port all 24 posts.** Josh reviews content later.
- The standalone Whitespace and Race Dad Astro sites become dead scaffolding. We copy
  their markdown and re-implement their look in Next. We do NOT keep them running.
- Reuse the existing `Aurora` component for the landing animation. Do NOT write a new
  animation engine.

## Routes

| Route | Brand | Posts |
|---|---|---|
| `/whitespace`, `/whitespace/[slug]` | Whitespace Designs | 7 (5 case studies + 2 essays) |
| `/race-dad`, `/race-dad/[slug]` | Race Dad | 24 |
| `/blog`, `/blog/[slug]` | AI blog | 6 |
| `/bring-your-idea-to-life` | Landing / CTA target | — |

37 posts total.

## SHARED CONTRACT — `src/lib/posts.js`

Owned by Agent A1. Everyone else CONSUMES it and must not edit it.
Build against this signature; it is frozen.

```js
// brand: 'whitespace' | 'race-dad' | 'ai'
export function getAllPosts(brand)       // -> Post[], sorted date DESC
export function getPostSlugs(brand)      // -> string[]
export async function getPost(brand, slug) // -> Post & { contentHtml: string }
```

Normalized `Post` shape — every field below is ALWAYS present (nullable where noted):

```js
{
  slug: string,
  brand: 'whitespace' | 'race-dad' | 'ai',
  title: string,
  date: string,            // ISO 'YYYY-MM-DD'
  excerpt: string,
  tags: string[],          // [] if none
  type: 'case-study' | 'essay' | 'post',
  client: string | null,       // whitespace case-study only
  deliverable: string | null,  // whitespace case-study only
  trim: string | null,         // whitespace case-study only
  colour: string | null,       // whitespace case-study only
  author: string | null,       // race-dad only
}
```

Content lives in `src/content/<brand>/*.md`. Slug = filename without `.md`.
Numeric filename prefixes (`01-`, `02-`) are STRIPPED from the slug.

## CSS ISOLATION — mandatory, this is the main failure mode

The portfolio has a dark global body and Tailwind preflight. The Astro stylesheets set
bare `body`, `h1`, `a` rules that WILL leak site-wide and break the homepage.

Rules every brand section must follow:

1. Brand CSS lives at `src/app/<section>/<brand>.css`, imported ONLY by that section's layout.
2. **Every selector must be scoped under the brand root class.** `.ws-root`, `.rd-root`, `.ai-root`.
   Never emit a bare `body {}`, `h1 {}`, or `a {}` rule.
   - Astro `body { background: X; color: Y }` becomes `.ws-root { background: X; color: Y; min-height: 100vh; }`
3. Fonts load via `next/font/google` in the section layout, exposed as a CSS variable.
   Do NOT use `<link>` tags to fonts.googleapis.com.
4. The section layout renders `<div className="ws-root">{children}</div>`.
5. Verify the homepage `/` is visually unchanged after your section is added.

## CTA — every blog funnels to the landing page

Both Astro sites currently CTA to `https://joshbyberg.com`. That is replaced.
Every blog index and every post page ends with a CTA to **`/bring-your-idea-to-life`**,
worded in that brand's voice, reading **"Bring Your Idea to Life"**.
Use a Next `<Link>`, not an `<a href>` to the absolute domain.

## Brand identities (from the Astro sources — preserve these exactly)

**Whitespace = press sheet.** Light. `--sheet:#FCFCFA --ink:#16161A --ink-60:#5C5C63
--ink-35:#96969C --rule:#DEDED8 --reg:#EC008C --cyan:#00A0DF --yellow:#FFF200`.
Schibsted Grotesk (display) / Literata (body) / DM Mono (spec).
Signature elements: fixed viewport crop marks, CMYK colour bar, the `.spec` mono label,
the wordmark whose `em` is a magenta rule that widens on hover, and the spec table
(Client / Deliverable / Trim / Colour) on case studies.
**Essays render WITHOUT the spec table** — that is why `type` exists.

**Race Dad = pit board.** Dark. `--asphalt:#1C1F22 --curb:#24282C --curb-hi:#2E3439
--paint:#F2F3F0 --gap:#8A939B --flag:#FFD400 --maple:#D22630`.
Big Shoulders Display (display, uppercase, 800) / Archivo (body) / Martian Mono (data).
Label class is `.data`, not `.spec`.

**AI blog = NEW, must be designed.** No source exists. Sibling to the other two, not a
clone. Dark technical/terminal register, distinct from Race Dad's dark — Race Dad is
warm asphalt + safety yellow, so the AI blog should NOT use yellow as its accent.
Reuse the portfolio's existing font stack and Tailwind so it feels native to the site.

## Landing page — `/bring-your-idea-to-life`

- H1: **"Bring Your Idea to Life"**. This is the single conversion target for all 37 posts.
- Background: the EXISTING `Aurora` component, re-skinned orange/white.
  Add a `palette` prop (`"aurora"` default | `"ember"` new). Default MUST stay blue so
  the homepage and `/oshawa` are unchanged. Ember = warm orange over near-white.
  Suggested: `#FF6A00`, `#FF9E2C`, `#FFD8A8` on `#FDFCFB`.
  `mix-blend-mode: screen` does not work over a light ground — use `multiply` or
  `normal` with lowered opacity for the ember palette and VERIFY it looks right.
- Keep every accessibility guard already in Aurora. Do not remove the reduced-motion,
  coarse-pointer, no-hover or visibilitychange logic.
- Content: what Josh does, who it is for, proof, and a contact action. Reuse the existing
  `EmailSection` contact pathway rather than inventing a new form.

## Definition of done (per agent)

- `npm run build` passes.
- Your routes render with real content and correct styling.
- The homepage `/` is visually unchanged.
- Report exactly what you ran and what the output was. Do not claim a gate passed
  without pasting its output.
